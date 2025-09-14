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

userRouter.get('/status', (req, res) => {
  console.log(req.session);
  return req.user ? res.status(200).send(req.user) : res.sendStatus(401);
});

userRouter.get('/:userId', checkUserStatus, async (req, res) => {
  const result = await db.query('SELECT id, username, created_at FROM users WHERE id = $1', [ req.params.userId ]);

  if(result.rowCount > 0) {
      res.status(200).send(result.rows);
  } else {
      res.status(404).send(`No user found with id of ${req.params.userId}`)
  }
});

userRouter.post('/register', db.createUser);

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

userRouter.post('/logout', (req, res) => {
  if (!req.user) return res.status(400).send("No user logged in");
  
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.sendStatus(200);
  })
});

userRouter.put('/:userId', checkUserStatus, db.updateUserPW);



// userRouter.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { 
//       console.log('inside error');
//       console.log(err);
    
//       return res.status(401).send(err.message)
//     }

//     return res.sendStatus(200);

//     // if (!user) {
//     //   // *** Display message using Express 3 locals
//     //   req.session.message = info.message;

//     //   res.sendStatus(401);
//     //   //return res.redirect('login');
//     // }
//     // req.logIn(user, function(err) {
//     //   if (err) { return next(err); }

//     //   res.sendStatus(200);
//     //   //return res.redirect('/users/' + user.username);
//     // });
//   })(req, res, next);
// });



// app.get('/protected', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info, status) {
//     if (err) { return next(err) }
//     if (!user) { return res.redirect('/signin') }
//     res.redirect('/account');
//   })(req, res, next);
// });

module.exports = userRouter;