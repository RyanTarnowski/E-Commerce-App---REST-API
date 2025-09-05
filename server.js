const express = require('express');
const app = express();
const port = 3000;

//Used for the config.env file setup and access
//require('dotenv').config({ path: './config.env' });
require('@dotenvx/dotenvx').config({ path: './config.env' });

const db = require('./db/index');



app.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM users;'); //db test
  res.send(result.rows);
});

app.listen(port, () => {
  console.log(`E-Commerce app listening on port ${port}`);
  console.log(`Connected to Postgres Server: ${process.env.PGHOST} Port: ${process.env.PGPORT} Database: ${process.env.PGDATABASE}`);
});