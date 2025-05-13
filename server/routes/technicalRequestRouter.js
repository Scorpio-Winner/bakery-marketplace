const Router = require('express').Router;
const TechnicalRequestController = require('../controllers/technicalRequestController');
const authenticateToken = require('../middleware/authenticateToken');

const router = Router();

router.post('/', authenticateToken, TechnicalRequestController.create);

module.exports = router;