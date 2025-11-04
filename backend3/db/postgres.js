// backend3/db/postgres.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // URL completa que te da Neon
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;