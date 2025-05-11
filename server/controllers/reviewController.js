const { Review, User, Bakery, Order, IndividualOrder } = require('../models/models');

class ReviewController {

    async createReview(req, res) {
        try {
            const { rating, short_review, description, orderId, individualOrderId } = req.body;
            const userId = req.user.userId;
    
            if (!userId) {
                return res.status(401).json({ message: 'Неавторизованный пользователь' });
            }
    
            let bakeryId;
    
            if (orderId) {
                // Проверка обычного заказа
                const order = await Order.findByPk(orderId);
                if (!order) {
                    return res.status(404).json({ message: 'Обычный заказ не найден' });
                }
                if (order.status !== 'выполнен') {
                    return res.status(400).json({ message: 'Отзыв можно оставить только для выполненных заказов' });
                }
    
                const existingReview = await Review.findOne({ where: { orderId } });
                if (existingReview) {
                    return res.status(400).json({ message: 'Отзыв для данного заказа уже существует' });
                }
    
                bakeryId = order.bakeryId;
            } else if (individualOrderId) {
                // Проверка индивидуального заказа
                const individualOrder = await IndividualOrder.findByPk(individualOrderId);
                if (!individualOrder) {
                    return res.status(404).json({ message: 'Индивидуальный заказ не найден' });
                }
                if (individualOrder.status !== 'выполнен') {
                    return res.status(400).json({ message: 'Отзыв можно оставить только для выполненных заказов' });
                }
    
                const existingReview = await Review.findOne({ where: { individualOrderId } });
                if (existingReview) {
                    return res.status(400).json({ message: 'Отзыв для данного индивидуального заказа уже существует' });
                }
    
                bakeryId = individualOrder.bakeryId;
            } else {
                return res.status(400).json({ message: 'Не указан заказ (orderId или individualOrderId)' });
            }
    
            // Создание отзыва
            const review = await Review.create({
                rating,
                short_review,
                description,
                orderId: orderId || null,  // Передаем NULL если нет обычного заказа
                individualOrderId: individualOrderId || null,  // Передаем NULL если нет индивидуального заказа
                bakeryId,
                userId,
            });
    
            return res.status(201).json({ message: 'Отзыв успешно создан', review });
    
        } catch (error) {
            console.error('Ошибка при создании отзыва:', error);
            return res.status(500).json({ message: 'Ошибка сервера при создании отзыва' });
        }
    }

    async getReviewById(req, res) {
        try {
            const { id } = req.params;

            const review = await Review.findByPk(id, {
                include: [
                    { model: Order },
                    { model: IndividualOrder },
                    { model: Bakery },
                    { model: User, attributes: ['name', 'surname', 'photo', 'id'] },
                ],
            });

            if (!review) {
                return res.status(404).json({ message: 'Отзыв не найден' });
            }

            res.json(review);
        } catch (error) {
            console.error('Ошибка при получении отзыва:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getAllReviews(req, res) {
        try {
            const reviews = await Review.findAll({
                include: [
                    { model: Order },
                    { model: IndividualOrder },
                    { model: Bakery },
                    { model: User, attributes: ['name', 'surname', 'photo', 'id'] },
                ],
                order: [['createdAt', 'DESC']],
            });

            res.json(reviews);
        } catch (error) {
            console.error('Ошибка при получении отзывов:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async updateReview(req, res) {
        try {
            const { id } = req.params;
            const { rating, short_review, description } = req.body;
            const userId = req.user.userId;

            const review = await Review.findByPk(id);
            if (!review) {
                return res.status(404).json({ message: 'Отзыв не найден' });
            }

            if (review.userId !== userId) {
                return res.status(403).json({ message: 'Нет доступа для редактирования этого отзыва' });
            }

            await review.update({
                rating,
                short_review,
                description,
            });

            res.json(review);
        } catch (error) {
            console.error('Ошибка при обновлении отзыва:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async deleteReview(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;

            const review = await Review.findByPk(id);
            if (!review) {
                return res.status(404).json({ message: 'Отзыв не найден' });
            }

            if (review.userId !== userId) {
                return res.status(403).json({ message: 'Нет доступа для удаления этого отзыва' });
            }

            await review.destroy();

            res.status(200).json({ message: 'Отзыв успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении отзыва:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getReviewsByBakery(req, res) {
        try {
            const { bakeryId } = req.params;

            const reviews = await Review.findAll({
                where: { bakeryId },
                include: [
                    { model: Order },
                    { model: IndividualOrder },
                    { model: Bakery },
                    { model: User, attributes: ['name', 'surname', 'photo', 'id'] },
                ],
                order: [['createdAt', 'DESC']],
            });

            res.json(reviews);
        } catch (error) {
            console.error('Ошибка при получении отзывов пекарни:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new ReviewController();
