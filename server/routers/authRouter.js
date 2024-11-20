const { Router } = require("express");
const userController = require("../controllers/userController");
const bakeryController = require("../controllers/bakeryController");
const authController = require("../controllers/authController");

const router = new Router();

router.post("/register/user", userController.create);
router.post("/register/bakery", bakeryController.create);

router.post("/login", authController.login);

router.post("/check-email", authController.checkEmail);

module.exports = router;