/**@frpanico
 * Middleware file
 * Check if the token generated during login
 * Grants access to certain admin/owner/loggedCustomer operation
 */
const jwt = require('jsonwebtoken');
const jwtSecret =
  '61ee06e2929764ddd97faf6339e56aea9bd5f83b5c6ee3130625c4ff54bdfc3eaf98c6';

exports.adminAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log('### Token', token);
  let authAlgoResult = [];
  authAlgo('admin', token)
    .then(result => {
      authAlgoResult = result;
      console.log('### Result', authAlgoResult);
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
  const authAlgoResult = authAlgo('owner', token);
  if (authAlgoResult.success) {
    next();
  } else {
    return res.status(401).json({message: authAlgo.message});
  }
};

exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  const authAlgoResult = authAlgo('customer', token);
  if (authAlgoResult.success) {
    next();
  } else {
    return res.status(401).json({message: authAlgo.message});
  }
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
    console.log('### Inside Algo', neededRole, token);
    const resultObj = {success: false, message: 'Not Authorized'};
    if (token) {
      jwtVerify(token)
        .then(result => {
          console.log('### DecodedToken', result.decodedToken);
          if (result.err) {
            reject(resultObj);
          } else {
            console.log('### Inside Non Error Condition');
            if (result.decodedToken.role !== neededRole) {
              console.log('### Inside Authorized condition');
              reject(resultObj);
            } else {
              console.log('### Inside Authorized condition');
              resultObj.success = true;
              resultObj.message = 'Authorized';
              console.log('### result Obj', resultObj);
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
