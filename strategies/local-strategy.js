const passport = require('passport');
const LocalStrategy = require('passport-local');
const db = require('../db/index');
const crypto = require('crypto');
const { devNull } = require('os');
const { error } = require('console');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await db.query("SELECT id, username FROM users WHERE id = $1", [ id ]);
        const dbuser = result.rows[0];

        if (!dbuser) return done(null, false, { message: 'User not found' }); //throw new Error('User not found');

        return done(null, dbuser);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const result = await db.query("SELECT id, username, password, salt FROM users WHERE username = $1", [ username ]);
        const dbuser = result.rows[0];

        if (!dbuser) return done(null, false, { message: 'User not found' }); //throw new Error('User not found');

        crypto.pbkdf2(password, Buffer.from(dbuser.salt, "hex"), 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) done(err, null); //throw err; 
            if (!crypto.timingSafeEqual(Buffer.from(dbuser.password, "hex"), hashedPassword)) return done(null, false, { message: 'Incorrect username or password' }); //throw new Error('Incorrect username or password'); 
            return done(null, dbuser);
        });
    } catch (err) {
        done(err, null);
    }  
}));