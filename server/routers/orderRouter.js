const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');

router.post('/orders/create', orderController.createOrder);
router.get('/orders/:orderId', orderController.getOrder);
router.get('/orders', orderController.getAllOrders);
router.patch('/orders/in-progress/:orderId', orderController.updateOrderStatusInProgress);
router.patch('/orders/cancelled/:orderId', orderController.updateOrderStatusCancelled);
router.patch('/orders/completed/:orderId', orderController.updateOrderStatusCompleted);

module.exports = router;