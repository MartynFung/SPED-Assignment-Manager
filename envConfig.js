const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbDatabase: process.env.DB_DATABASE,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  nodeEnv: process.env.NODE_ENV,
  dbUrl: process.env.DATABASE_URL,
  port: process.env.PORT,
};
