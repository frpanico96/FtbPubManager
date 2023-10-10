/**@frpanico
 * Server Side file for Users
 * It handles:
 * -- Insert
 * -- Login
 * -- Update user
 * -- Delete user
 */
const User = require('../model/User');
const Log = require('../model/Log');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret =
  '61ee06e2929764ddd97faf6339e56aea9bd5f83b5c6ee3130625c4ff54bdfc3eaf98c6';

exports.register = async (req, res, next) => {
  const {username, password, isOwner} = req.body;

  if (password.length < 6) {
    return res.status(400).json({
      message: 'login-register-pass-length',
      error: 'login-register-pass-length',
    });
  }
  try {
    bcrypt.hash(password, 10).then(async hash => {
      await User.create({
        username,
        password: hash,
        role: isOwner ? 'owner' : 'customer',
      })
        .then(user => {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            {id: user._id, username, role: user.role},
            jwtSecret,
            {
              expiresIn: maxAge,
            },
          );
          res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
          Log.create({
            user: user._id,
            method: 'REGISTER',
            timeStamp: new Date(),
          })
            .then(log => {
              res.status(201).json({message: 'login-register-success', user});
            })
            .catch(error => {
              return res.status(400).json({
                message: 'Error',
                error: error.message,
              });
            });
        })
        .catch(error =>
          res.status(400).json({
            message: 'login-register-failure',
            error: error.message,
          }),
        );
    });
  } catch (err) {
    res.status(401).json({
      message: 'login-register-failure',
      error: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: 'login-login-nouserpass',
      error: 'login-login-nouserpass',
    });
  }
  try {
    const user = await User.findOne({username});
    if (!user) {
      res.status(401).json({
        message: 'login-login-failure',
        error: 'login-login-usernotfound',
      });
    } else {
      bcrypt.compare(password, user.password).then(result => {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            {id: user._id, username, role: user.role},
            jwtSecret,
            {expiresIn: maxAge},
          );
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
          });
          Log.create({
            user: user._id,
            method: 'LOGIN',
            timeStamp: new Date(),
          })
            .then(log => {
              res.status(201).json({message: 'login-login-success', user});
            })
            .catch(error => {
              return res.status(400).json({
                message: 'Error',
                error: error.message,
              });
            });
        } else {
          res.status(400).json({
            message: 'login-login-invalid',
            error: 'login-login-invalid',
          });
        }
      });
    }
  } catch (error) {
    res.status(400).json({message: 'Login Failed', error: error.message});
  }
};

exports.update = async (req, res, next) => {
  const {role, id} = req.body;
  if (role && id) {
    if (role === 'admin') {
      await User.findById(id).then(user => {
        if (user.role !== 'admin') {
          user.role = role;
          user
            .save()
            .then(newUser =>
              res.status(201).json({message: 'Update successful', newUser}),
            )
            .catch(err => {
              res
                .status(400)
                .json({message: 'An error occurred', error: err.message});
              process.exit(1);
            });
        } else {
          return res.status(400).json({
            message: 'User is already admin',
            error: 'User is already admin',
          });
        }
      });
    } else {
      res.status(400).json({
        message: 'Insufficient Permission',
        error: 'Insufficient Permission',
      });
    }
  } else {
    res.status(400).json({
      message: 'Role or Id not specified',
      error: 'Role or Id not specified',
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  const {id} = req.body;
  await User.findById(id)
    .then(user => user.deleteOne())
    .then(user =>
      res.status(201).json({message: 'User succesfully deleted', user}),
    )
    .catch(error =>
      res.status(400).json({message: 'An error occured', error: error.message}),
    );
};

exports.guestLogin = async (req, res, next) => {
  await Log.create({
    isGuest: true,
    method: 'GUEST_LOGIN',
    timeStamp: new Date(),
  })
    .then(log => {
      res.status(200).json({message: 'Success'});
    })
    .catch(error => {
      return res.status(400).json({
        message: 'Error',
        error: error.message,
      });
    });
};
