const express = require('express');
const app = express();
const port = 3000;

//Used for the config.env file setup and access
require('dotenv').config({ path: './config.env' });
require('@dotenvx/dotenvx').config()

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});