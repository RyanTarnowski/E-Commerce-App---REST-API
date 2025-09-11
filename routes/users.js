const express = require('express');
const userRouter =  express.Router();
const db = require('../db/index');
const passport = require('passport');

// userRouter.get('/', async (req, res) => {
//   if (!req.user) return res.sendStatus(401);
//   const result = await db.query('SELECT * FROM users;');
//   res.status(200).send(result.rows);
// });

const checkUserStatus = (req, res, next) =>{
  if (!req.user) return res.sendStatus(401);
  if (req.user.id != req.params.userId) return res.sendStatus(401);
  next();
};

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

userRouter.get('/:userId', checkUserStatus, async (req, res) => {
  const result = await db.query('SELECT id, username, created_at FROM users WHERE id = $1', [ req.params.userId ]);

  if(result.rowCount > 0) {
      res.status(200).send(result.rows);
  } else {
      res.status(404).send();
  }
});

userRouter.put('/:userId', checkUserStatus, db.updateUserPW);

module.exports = userRouter;