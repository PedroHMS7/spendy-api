require('dotenv').config({ path: process.env.ENV_FILE || '.env' });

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    },
    migrations: {
      directory: './src/migrations'
    }
  }
};