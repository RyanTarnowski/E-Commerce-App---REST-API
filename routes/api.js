const express = require('express');
const apiRouter = express.Router();
const userRouter = require('./users');
const productRouter = require('./products');
const cartRouter = require('./carts');
const orderRouter = require('./orders');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/E-Commerce API.json');

apiRouter.use('/users', userRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/docs', swaggerUi.serve);
apiRouter.get('/docs', swaggerUi.setup(swaggerDocument));

module.exports = apiRouter;