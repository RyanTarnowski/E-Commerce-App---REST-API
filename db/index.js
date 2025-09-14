const pg = require('pg');
const { Pool, Client } = pg;
const pool = new Pool();
const crypto = require('crypto');

async function query (text, params) {
    let client
    try {
        client = await pool.connect();
        return await client.query(text, params);
    } catch (err) {
        console.error(err.message);
        throw err.message;
    } finally {
        client.release();
    }
};

const createUser = (req, res) => {
    const { username, password } = req.body;
    const salt = crypto.randomBytes(16);
    const hashed_password = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256');

    if (!username || !password) return res.status(400).send("Invalid request");

    pool.query('INSERT INTO users (username, password, salt) VALUES ($1, $2, $3) RETURNING *', [username, hashed_password.toString('hex'), salt.toString('hex')], (error, results) => {
        if (error) {
            if (error.code == 23505) return res.status(400).send(`${username} already exists`);          
            console.log(error);
            return res.status(400).send(error.message);
        }
        res.status(201).send(`User added with ID: ${results.rows[0].id}`);
    });
}

const updateUserPW = (req, res) => {
    const { password } = req.body;
    const salt = crypto.randomBytes(16);
    const hashed_password = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256');

    if (!req.params.userId || !password) return res.status(400).send("Invalid request.");

    pool.query('UPDATE users SET password = $1, salt = $2 WHERE id = $3 RETURNING *', [hashed_password.toString('hex'), salt.toString('hex'), req.params.userId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(400).send(error.message);
        }      
        req.logout((err) => {
            if (err) return res.sendStatus(400);
            res.status(201).send(`Password updated, please re-login`);
        })
    });
}

module.exports = {query, createUser, updateUserPW};