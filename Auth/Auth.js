const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = '61ee06e2929764ddd97faf6339e56aea9bd5f83b5c6ee3130625c4ff54bdfc3eaf98c6';

exports.register = async (req, res, next) => {
  const {username, password} = req.body;

  if (password.length < 6) {
    return res
      .status(400)
      .json({message: 'Password must be at least 6 characters long'});
  }
  try {
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        username,
        password: hash,
      }).then(user => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign({id: user._id, username, role: user.role},
          jwtSecret,
          {
            expiresIn: maxAge
          });
        res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({message: 'User succesfully created', user});
      }
      ).catch(error => res.status(400).json({message: 'User not successfully created', error: error.message}));
    });
  } catch (err) {
    res.status(401).json({
      message: 'User not successfully created',
      error: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: 'Username or Password not provided'});
  };
  try {
    const user = await User.findOne({username});
    if(!user){
      res.status(401).json({message: "Login Failed", error: "User not found"});
    }
    else
    {
      bcrypt.compare(password, user.password).then(result => {
        
        if(result) {
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
          res.status(201).json({message: "Login Succesfull", user})
        }
        else {
          res.status(400).json({message: 'Login not successful'});
        }
      });
    }
  }
  catch (error)
  {
    res.status(400).json({message: "Login Failed", error: error.message});
  }
}

exports.update = async (req, res, next) => {
  const {role, id} = req.body;
  if(role && id)
  {
    if(role === 'admin')
    {
      await User.findById(id)
        .then(user => {
          if(user.role !== 'admin'){
            user.role = role;
            user.save()
            .then(user => res.status(201).json({message: 'Update successful', user}))
            .catch(err => {
                res.status.json(400).json({message: 'An error occurred', error: err.message});
                process.exit(1);
              
            });
          }
          else{
            res.status(400).json({message: 'User is already admin', error: 'User is already admin'});
          }
        });
    }
    else
    {
      res.status(400).json({message: 'Insufficient Permission', error: 'Insufficient Permission'});
    }
  }
  else
  {
    res.status(400).json({message: 'Role or Id not specified', error: 'Role or Id not specified'})
  }
}


exports.deleteUser = async (req, res, next) => {
  const {id} = req.body;
  await User.findById(id)
  .then(user => user.deleteOne())
  .then(user => res.status(201).json({message: 'User succesfully deleted', user}))
  .catch(error => res.status(400).json({message: 'An error occured', error: error.message}));

}
