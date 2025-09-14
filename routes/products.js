const express = require('express');
const productRouter = express.Router();
const db = require('../db/index');

productRouter.get('/', async (req, res) => {
    const {query: { filter, value }, } = req;
    let result

    if (filter && value) {
        result = await db.query(`SELECT * FROM products WHERE ${filter} = $1;`, [ value ]);
    } else {
        result = await db.query('SELECT * FROM products;');
    }

    if(result.rowCount > 0) {
        res.status(200).send(result.rows);
    } else {
        res.status(404).send(`No products found`)
    }
});

productRouter.get('/:productId', async (req, res) => {
    const result = await db.query('SELECT * FROM products WHERE id = $1;', [ req.params.productId ]);

    if(result.rowCount > 0) {
        res.status(200).send(result.rows);
    } else {
        res.status(404).send(`No product found with id of ${req.params.productId}`)
    }
});

module.exports = productRouter;