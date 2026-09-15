require('dotenv').config();

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  dateStrings: true,
  ssl: process.env.NODE_ENV === 'production' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined
});

export = pool;