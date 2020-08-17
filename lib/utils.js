const jwt = require('jsonwebtoken');

const Utils = {
  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  /**
   * generateAccessToken helper method
   * @param {object} payload
   * @returns {string} accessToken
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '60s',
    });
  },
  /**
   * generateRefreshToken helper method
   * @param {object} payload
   * @returns {string} refreshToken
   */
  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
  },
  /**
   * generatePayload helper method
   * @param {object} user
   * @returns {object} payload
   */
  generatePayload(user) {
    return {
      id: user.user_base_id,
      roles: user.roles,
    };
  },
};

module.exports = Utils;
