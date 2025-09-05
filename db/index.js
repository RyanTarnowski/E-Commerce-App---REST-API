const pg = require('pg');
const { Pool, Client } = pg;
const pool = new Pool();

async function query (text, params) {
    let client
    try {
        client = await pool.connect();
        return await client.query(text, params);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
    }
};

module.exports = {query};