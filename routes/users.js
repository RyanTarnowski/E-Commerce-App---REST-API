const express = require('express');
const userRouter =  express.Router();
const db = require('../db/index');

userRouter.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM users;'); //db test
  res.send(result.rows);
});

//userRouter.post('/register', db.createUser);

userRouter.post('/register', db.createUserHashed);

module.exports = userRouter;