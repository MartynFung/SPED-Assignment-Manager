const { Pool } = require('pg');
const {
  dbUser,
  dbPassword,
  dbDatabase,
  dbHost,
  dbPort,
  nodeEnv,
} = require('../envConfig');

const pool = new Pool({
  user: dbUser,
  password: dbPassword,
  database: dbDatabase,
  host: dbHost,
  port: dbPort,
  max: 20,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0,
});

// const isProduction = nodeEnv === 'production';
// const connectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}`;
// const pool = new Pool({
//   connectionString: isProduction ? process.env.DATABASE_URL : connectionString
// });

module.exports = pool;
