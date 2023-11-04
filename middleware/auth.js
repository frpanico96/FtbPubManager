/**@frpanico
 * Middleware file
 * Check if the token generated during login
 * Grants access to certain admin/owner/loggedCustomer operation
 */
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
const SCORE_MAP = {
  guest: 10,
  customer: 20,
  owner: 30,
  admin: 40,
};
console.log(process.env.JWT_SECRET);
exports.adminAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  //console.log('### Token', token);
  let authAlgoResult = [];
  authAlgo('admin', token)
    .then(result => {
      authAlgoResult = result;
      //console.log('### Result', authAlgoResult);
      if (authAlgoResult.success) {
        next();
      } else {
        return res.status(401).json({message: authAlgo.message});
      }
    })
    .catch(error => {
      return res.status(401).json({message: error});
    });
};

exports.ownerAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  let authAlgoResult = [];
  authAlgo('owner', token)
    .then(result => {
      authAlgoResult = result;
      //console.log('### Result', authAlgoResult);
      if (authAlgoResult.success) {
        next();
      } else {
        return res.status(401).json({message: authAlgo.message});
      }
    })
    .catch(error => {
      return res.status(401).json({message: error});
    });
};

exports.customerAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  let authAlgoResult = [];
  authAlgo('customer', token)
    .then(result => {
      authAlgoResult = result;
      //console.log('### Result', authAlgoResult);
      if (authAlgoResult.success) {
        next();
      } else {
        return res.status(401).json({message: authAlgo.message});
      }
    })
    .catch(error => {
      return res.status(401).json({message: error});
    });
};

exports.guestAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  let authAlgoResult = [];
  authAlgo('guest', token)
    .then(result => {
      authAlgoResult = result;
      //console.log('### Result', authAlgoResult);
      if (authAlgoResult.success) {
        next();
      } else {
        return res.status(401).json({message: authAlgo.message});
      }
    })
    .catch(error => {
      return res.status(401).json({message: error});
    });
};

const jwtVerify = async token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      resolve({err, decodedToken});
    });
  });
};

const authAlgo = async (neededRole, token) => {
  return new Promise((resolve, reject) => {
    //console.log(process.env.JWT_SECRET);
    //console.log('### Inside Algo', neededRole, token);
    const resultObj = {success: false, message: 'Not Authorized'};
    if (token) {
      jwtVerify(token)
        .then(result => {
          //console.log('### DecodedToken', result.decodedToken);
          if (result.err) {
            reject(resultObj);
          } else {
            //console.log('### Inside Non Error Condition');
            if (SCORE_MAP[result.decodedToken.role] < SCORE_MAP[neededRole]) {
              //console.log('### Inside Authorized condition');
              reject(resultObj);
            } else {
              //console.log('### Inside Authorized condition');
              resultObj.success = true;
              resultObj.message = 'Authorized';
              //console.log('### result Obj', resultObj);
              resolve(resultObj);
            }
          }
        })
        .catch(error => {
          reject(error);
        });
    } else {
      resultObj.message = 'Not Authorized, token not available';
      resolve(resultObj);
    }
  });
};
