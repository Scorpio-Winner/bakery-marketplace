const Router = require('express').Router;
const router = new Router();

router.use('/users', require('./userRouter'));
router.use('/reviews', require('./reviewRouter'));
router.use('/products', require('./productRouter'));
router.use('/bakeries', require('./bakeryRouter'));
router.use('/orders', require('./orderRouter'));
router.use('/individualOrders', require('./individualOrderRouter'));
router.use('/baskets', require('./basketRouter'));
router.use('/technical-requests', require('./technicalRequestRouter'));


module.exports = router;