const express = require('express');
const apiRouter = express.Router();
const userRouter = require('./users');
const productRouter = require('./products');

apiRouter.use('/users', userRouter);
apiRouter.use('/products', productRouter);

module.exports = apiRouter;