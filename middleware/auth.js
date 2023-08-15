const jwt = require('jsonwebtoken');
const jwtSecret = '61ee06e2929764ddd97faf6339e56aea9bd5f83b5c6ee3130625c4ff54bdfc3eaf98c6';

exports.adminAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if(token)
  {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if(err){
        return res.status(401).json({message: "Not Authorized"});
      }
      else{
        if(decodedToken.role !== 'admin'){
          return res.status(401).json({message: 'Not Authorized'});
        }
        else{
          next();
        }
      }
    });
  } else {
    return res.status(401).json({message: 'Not Authorized, token not available'});
  }
};

exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if(token)
  {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if(err){
        return res.status(401).json({message: "Not Authorized"});
      }
      else{
        if(decodedToken.role !== 'customer'){
          return res.status(401).json({message: 'Not Authorized'});
        }
        else{
          next();
        }
      }
    });
  } else {
    return res.status(401).json({message: 'Not Authorized, token not available'});
  }
};