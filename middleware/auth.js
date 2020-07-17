const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers['Authorization'];
  // If authorization header exists, return the token portion: Bearer TOKEN
  const accessToken = authHeader && authHeader.split(' ')[1];

  // Check for token
  if (!accessToken)
    return res.status(401).json({ msg: 'No token, authorization denied' });

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err)
      return res
        .status(401)
        .json({ msg: 'Token verification failed, authorization denied.' });

    req.user = payload;
    console.log('req.user', req.user);
    next();
  });
};

module.exports = auth;

// Gives API routes access to req.user from token's payload
/* 
    req.user {
      id: '20f130dc-c458-11ea-bf77-06b2e3e918cb',
      role: 'd515d3cc-c3ec-11ea-8dbe-06b2e3e918cb',
      iat: 1594611710,
      exp: 1594611770
    } 
*/
