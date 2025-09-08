const pg = require('pg');
const { Pool, Client } = pg;
const pool = new Pool();
var crypto = require('crypto');

async function query (text, params) {
    let client
    try {
        client = await pool.connect();
        return await client.query(text, params);
    } catch (err) {
        //console.error(err.message);
        throw err.message;
    } finally {
        client.release();
    }
};

const createUser = (request, response) => {
    const { username, password } = request.body;

    if (!username || !password)
    {
        return response.status(400).send("Invalid request.");
    }

    pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password], (error, results) => {
        if (error) {     
            return response.status(400).send(error);
        }
        response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    });
}

const createUserHashed = (request, response) => {
    const { username, password } = request.body;
    const salt = crypto.randomBytes(16);
    const hashed_password = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256');

    if (!username || !password)
    {
        return response.status(400).send("Invalid request.");
    }

    pool.query('INSERT INTO users (username, password, salt) VALUES ($1, $2, $3) RETURNING *', [username, hashed_password, salt], (error, results) => {
        if (error) {     
            return response.status(400).send(error);
        }
        response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    });
}

module.exports = {query, createUser, createUserHashed};