const Router = require('express');
const router = new Router();
const basketController = require('../controllers/basketController');

router.post('/:userId', basketController.createOrUpdateBasket);
router.post('/add', basketController.addProductToBasket);
router.delete('/:basketId/:productId', basketController.removeProductFromBasket);
router.patch('/order/:orderId', basketController.updateOrderStatus);

module.exports = router;