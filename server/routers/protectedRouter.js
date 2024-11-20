const { Router } = require("express");
const userController = require("../controllers/userController");
const bakeryController = require("../controllers/bakeryController");
const basketItemController = require("../controllers/basketItemController");
const orderController = require("../controllers/orderController");
const reviewController = require("../controllers/reviewController");
const productController = require("../controllers/productController");


const router = new Router();

router.get("/user", userController.getProfile);
router.get("/admin", bakeryController.getProfile);

router.get("/all-users", userController.getAll);
router.put("/user/update/:id", userController.update);

router.post("/product-to-basket", basketItemController.setProductToBasket);
router.get("/basket-to-order/:id", basketItemController.getProductToOrderForm);
router.delete("/delete-items/:basketId", basketItemController.deleteItemsByBasketId);



router.post("/create-order", orderController.createOrder);
router.get("/completed-orders/:id", orderController.getCompletedOrders);
router.get("/in-process-orders/:id", orderController.getInProcessOrders);



router.get("/review/:id", reviewController.getReviewByOrderID);
router.get("/review", reviewController.getReviewByBakeryID);
router.post("/create-review", reviewController.createReview);
router.put("/order/update/:id", orderController.updateOrderStatusCancelled);
router.put("/order/update/complete/:id", orderController.updateOrderStatusCompleted);
router.put("/order/update/in-progress/:id", orderController.updateOrderStatusInProgress);


router.get("/completed-orders", orderController.getAllCompletedOrders);
router.get("/in-process-orders", orderController.getAllInProcessOrders);








router.get("/admins", bakeryController.getAll);

module.exports = router;