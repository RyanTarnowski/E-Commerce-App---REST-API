const express = require('express');
const orderRouter = express.Router();
const db = require('../db/index');

const checkUserStatus = (req, res, next) =>{
    if (!req.user) return res.sendStatus(401);
    next();
};

orderRouter.get('/', checkUserStatus, async (req, res) => {
    const result = await db.query(`SELECT orders.id, orders.user_id, orders.status, orders.created_at, COUNT(*) AS items_in_order, SUM(order_details.price * order_details.qty) AS total
                                   FROM orders
                                   INNER JOIN order_details ON order_details.order_id = orders.id
                                   INNER JOIN products ON order_details.product_id = products.id
                                   WHERE user_id = $1 
                                   GROUP BY orders.id, orders.user_id, orders.status, orders.created_at;`, [ req.user.id ]);

    if(result.rowCount > 0) {
        res.status(200).send(result.rows);
    } else {
        res.status(404).send(`No orders found`)
    }
});

orderRouter.get('/:orderId', checkUserStatus, async (req, res) => {
    const result = await db.query(`SELECT orders.id, orders.user_id, orders.status, orders.created_at, products.name, products.description, order_details.qty, 
                                       SUM(order_details.price * order_details.qty) AS total
                                   FROM orders
                                   INNER JOIN order_details ON order_details.order_id = orders.id
                                   INNER JOIN products ON order_details.product_id = products.id
                                   WHERE user_id = $1 AND orders.id = $2
                                   GROUP BY orders.id, orders.user_id, orders.status, orders.created_at, products.name, products.description, order_details.qty;`, [ req.user.id, req.params.orderId ]);

    if(result.rowCount > 0) {
        res.status(200).send(result.rows);
    } else {
        res.status(404).send(`No orders found with id of ${req.params.orderId}`)
    }
});

module.exports = orderRouter;