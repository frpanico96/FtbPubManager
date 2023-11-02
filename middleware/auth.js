/**@frpanico
 * Middleware file
 * Check if the token generated during login
 * Grants access to certain admin/owner/loggedCustomer operation
 */
const jwt = require('jsonwebtoken');
const jwtSecret =
  '61ee06e2929764ddd97faf6339e56aea9bd5f83b5c6ee3130625c4ff54bdfc3eaf98c6';

exports.adminAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log('### Token', token);
  console.log('### Funciont Call', authAlgo('admin', token));
  const authAlgoResult = await authAlgo('admin', token);
  console.log('### Result', authAlgoResult);
  if (authAlgoResult.success) {
    next();
  } else {
    return res.status(401).json({message: authAlgo.message});
  }
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

const authAlgo = (neededRole, token) => {
  console.log('### Inside Algo', neededRole, token);
  const resultObj = {success: false, message: 'Not Authorized'};
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      console.log('### DecodedToken', decodedToken);
      if (err) {
        return resultObj;
      } else {
        console.log('### Inside Non Error Condition');
        if (decodedToken.role !== neededRole) {
          console.log('### Inside Authorized condition');
          return resultObj;
        } else {
          console.log('### Inside Authorized condition');
          resultObj.success = true;
          resultObj.message = 'Authorized';
          console.log('### result Obj', resultObj);
          return resultObj;
        }
      }
    });
  } else {
    resultObj.message = 'Not Authorized, token not available';
    return resultObj;
  }
};
