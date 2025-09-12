const express = require('express');
const apiRouter = express.Router();
const userRouter = require('./users');
const productRouter = require('./products');
const cartRouter = require('./carts');
const orderRouter = require('./orders');

apiRouter.use('/users', userRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/orders', orderRouter);

module.exports = apiRouter;