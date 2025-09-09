const express = require('express');
const userRouter =  express.Router();
const db = require('../db/index');
const passport = require('passport');

// userRouter.get('/', async (req, res) => {
//   if (!req.user) return res.sendStatus(401);
//   const result = await db.query('SELECT * FROM users;');
//   res.status(200).send(result.rows);
// });

userRouter.post('/register', db.createUser);

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

userRouter.get('/status', (req, res) => {
  console.log(req.session);
  return req.user ? res.status(200).send(req.user) : res.sendStatus(401);
});

userRouter.post('/logout', (req, res) => {
  if (!req.user) return res.sendStatus(401);
  
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.sendStatus(200);
  })
});

module.exports = userRouter;