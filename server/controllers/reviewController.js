const { Review, Order, User } = require('../models/models');

class ReviewController {
  async createReview(req, res) {
    const { rating, short_review, description, orderId } = req.body;

    try {

      const review = await Review.create({
        rating,
        short_review,
        description,
        orderId: orderId
      });

      return res.status(201).json({ review });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  async getAllReviews(req, res) {
    try {
      const reviews = await Review.findAll({
        include: [{ model: Order, include: [{ model: User }] }],
    });
      return res.json(reviews);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  async getReviewByOrderID(req, res) {
    const { id } = req.params; // изменение здесь
  
    try {
      const review = await Review.findOne({ where: { orderId : id } });

      if (!review || review.length === 0) {
      return res.status(404).json({ message: 'Продукты не найдены для данной корзины' });
      }

      return res.status(200).json( review );
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ошибка сервера при поиске продуктов для данной корзины' });
  }
}
  
}

module.exports = new ReviewController();