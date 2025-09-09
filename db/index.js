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

    if (!username || !password) return res.status(400).send("Invalid request.");

    pool.query('INSERT INTO users (username, password, salt) VALUES ($1, $2, $3) RETURNING *', [username, hashed_password.toString('hex'), salt.toString('hex')], (error, results) => {
        if (error) {     
            return res.status(400).send(error);
        }
        res.status(201).send(`User added with ID: ${results.rows[0].id}`);
    });
}

module.exports = {query, createUser};