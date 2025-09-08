const express = require('express');
const app = express();
const port = 3000;

//Used for the config.env file setup and access
//require('dotenv').config({ path: './config.env' });
require('@dotenvx/dotenvx').config({ path: './config.env' });

//Add middware for parsing request bodies:
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Mount apiRouter:
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`E-Commerce app listening on port ${port}`);
  console.log(`Connected to Postgres Server: ${process.env.PGHOST} Port: ${process.env.PGPORT} Database: ${process.env.PGDATABASE}`);
});