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
  const authAlgoResult = authAlgo('admin', token);
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
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      console.log('### DecodedToken', decodedToken);
      if (err) {
        return {success: false, message: 'Not Authorized'};
      } else {
        if (decodedToken.role !== neededRole) {
          return {success: false, message: 'Not Authorized'};
        } else {
          return {success: true, message: 'Authorized'};
        }
      }
    });
  } else {
    return {success: false, message: 'Not Authorized, token not available'};
  }
};
