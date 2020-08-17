const router = require('../routes/auth');

// Provide an array of roles you want to use to protect a route. This function will check if any of the user roles match.
const authRole = (routeRoles = []) => {
  // roles param can be a single role string (e.g. ROLE.ADMIN or 'ADMIN')
  // or an array of roles (e.g. [ROLE.ADMIN, ROLE.USER] or ['ADMIN', 'USER'])
  if (typeof roles === 'string') {
    routeRoles = [routeRoles];
  }

  return (req, res, next) => {
    const userHasRole = findCommonRoles(req.user.roles, routeRoles);
    if (routeRoles.length && !userHasRole) {
      return res.status(403).send('Not allowed');
    }
    next();
  };
};

const findCommonRoles = (userRoles, routeRoles) => {
  return userRoles.some((userRole) => routeRoles.includes(userRole));
};

module.exports = authRole;
