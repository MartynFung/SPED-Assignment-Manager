const { ROLE } = require('../lib/roles');

const canViewTeacher = (user) => {
  const isAdmin = user.roles.find((role) => role === ROLE.ADMIN);
  const isTeacher = user.roles.find((role) => role === ROLE.TEACHER);
  return isAdmin || isTeacher;
};

module.exports = {
  canViewTeacher,
};
