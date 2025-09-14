const express = require('express');
const cartRouter = express.Router();
const db = require('../db/index');

const checkUserStatus = (req, res, next) =>{
    if (!req.user) return res.sendStatus(401);
    next();
};

cartRouter.get('/', checkUserStatus, async (req, res) => {
    const result = await db.query('SELECT * FROM user_cart WHERE user_id = $1;', [req.user.id]);

    if (result.rowCount > 0) {
        res.status(200).send(result.rows);
    } else {
        res.status(404).send(`No products in cart`)
    }
});

cartRouter.post('/', checkUserStatus, async (req, res) => {
    const { product_id, qty } = req.body;

    if (!product_id || !qty) return res.status(400).send("Invalid request");

    const result = await db.query('INSERT INTO user_cart (user_id, product_id, qty) VALUES ($1, $2, $3) RETURNING *', [req.user.id, product_id, qty]);

    if (result.rowCount > 0) {
        res.status(200).send(result.rows);
    } else {
        res.sendStatus(400);
    }
});

cartRouter.put('/', checkUserStatus, async (req, res) => {
    const { product_id, qty } = req.body;
    
    if (!product_id || !qty) return res.status(400).send("Invalid request");

    const result = await db.query('UPDATE user_cart SET qty = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *', [qty, req.user.id, product_id]);

    if (result.rowCount > 0) {
        res.status(200).send(result.rows);
    } else {
        res.sendStatus(400);
    }
});

cartRouter.delete('/:productId', checkUserStatus, async (req, res) => {
    if (!req.params.productId) return res.status(400).send("Invalid request");

    const result = await db.query('DELETE FROM user_cart WHERE user_id = $1 AND product_id = $2 RETURNING *', [req.user.id, req.params.productId]);

    if (result.rowCount > 0) {
        res.status(200).send(result.rows);
    } else {
        res.sendStatus(400);
    }
});

cartRouter.post('/checkout', checkUserStatus, async (req, res) => {
    const { card_holder, card_number, card_cvv } = req.body;

    if (!card_holder || !card_number || !card_cvv) return res.status(400).send("Invalid payment info");

    const result = await db.query(`SELECT COUNT(*) AS item_count, SUM(price * qty) AS total 
                                   FROM user_cart 
                                   INNER JOIN products ON user_cart.product_id = products.id 
                                   WHERE user_id = $1`, [req.user.id]);

    if (result.rows[0].item_count <= 0) return res.status(400).send('There are no items in your cart to checkout');

    //Fake some payment processing
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const paymentResult = await delay(5000);

    if (paymentResult === false) return res.status(400).send('Payment was not accepted');

    //insert cart into a new order
    const orderResult = await db.query('INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *', [req.user.id, 'Processing']);

    if (orderResult.rowCount > 0) {
        console.log(orderResult.rows);

        const orderDetailResult = await db.query(`INSERT INTO order_details (order_id, product_id, qty, price)
                                                  SELECT $1, product_id, qty, products.price
                                                  FROM user_cart
                                                  INNER JOIN products ON user_cart.product_id = products.id
                                                  WHERE user_id = $2
                                                  RETURNING *`, [ orderResult.rows[0].id, req.user.id ]);

        db.query('DELETE FROM user_cart WHERE user_id = $1', [req.user.id]);

        if (orderDetailResult.rowCount > 0) {
            res.status(200).send(orderDetailResult.rows);
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
});

module.exports = cartRouter;