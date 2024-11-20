const Router = require('express');
const router = new Router();
const ReviewController = require('../controllers/reviewController');

router.post('/review/create', ReviewController.createReview);
router.get('', ReviewController.getAllReviews);

module.exports = router;