const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  max: 20,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0,
});

// TODO: different connection string if dev or prod

// const isProduction = nodeEnv === 'production';
// const connectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}`;
// const pool = new Pool({
//   connectionString: isProduction ? process.env.DATABASE_URL : connectionString
// });

module.exports = pool;
