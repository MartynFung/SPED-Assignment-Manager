const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '../cryptography', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

const Utils = {
  /**
   * -------------- HELPER FUNCTIONS ----------------
   */

  /**
   *
   * @param {*} password - The plain text password
   * @param {*} hash - The hash stored in the database
   * @param {*} salt - The salt stored in the database
   *
   * This function uses the crypto library to decrypt the hash using the salt and then compares
   * the decrypted hash/salt with the password that the user provided at login
   */
  validatePassword(password, hash, salt) {
    var hashVerify = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    return hash === hashVerify;
  },

  /**
   *
   * @param {*} password - The password string that the user inputs to the password field in the register form
   *
   * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
   * password in the database, the salt and hash are stored for security
   *
   * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
   * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
   */
  saltHashPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');

    return {
      salt: salt,
      hash: genHash,
    };
  },

  /**
   * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the postgres user ID
   */
  issueJWT(user) {
    const payload = {
      sub: user.id,
      iat: Date.now(), // issued at time
      role: user.role,
    };

    const signedToken = jwt.sign(payload, PRIV_KEY, {
      expiresIn: '30s',
      algorithm: 'RS256',
    });

    return {
      token: `Bearer ${signedToken}`,
      expires: '1m',
    };
  },
  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
};

module.exports = Utils;