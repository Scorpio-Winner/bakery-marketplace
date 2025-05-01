const { IndividualOrder, User, Bakery, Review } = require('../models/models');

class IndividualOrderController {

    async createIndividualOrder(req, res) {
        try {
            const { delivery_address, description, bakeryId } = req.body;
            const userId = req.user.userId;

            console.log('User ID:', userId);

            const individualOrder = await IndividualOrder.create({
                delivery_address,
                description,
                status: 'на рассмотрении',
                date_of_ordering: new Date(),
                userId,
                bakeryId,
                photo: req.file ? `/uploads/individualorders/${req.file.filename}` : null,
            });

            console.log('individual order created successfully:', individualOrder);
            res.status(201).json({ message: 'Заказ успешно создан', individualOrder });
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getUserIndiviudalOrders(req, res) {
        try {
            const userId = req.user.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Неавторизованный пользователь' });
            }

            const individualOrders = await IndividualOrder.findAll({
                where: { userId },
                include: [
                    {
                        model: Review,
                        include: [{ model: User, attributes: ['name', 'surname'] }],
                    },
                ],
                order: [['date_of_ordering', 'DESC']],
            });

            res.json(individualOrders);
        } catch (error) {
            console.error('Ошибка при получении заказов пользователя:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getIndividualOrderById(req, res) {
        try {
            const { id } = req.params;

            const individualOrder = await IndividualOrder.findByPk(id, {
                include: [
                    {
                        model: Review,
                        include: [{ model: User, attributes: ['name', 'surname'] }],
                    },
                ],
            });

            if (!individualOrder) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            res.json(individualOrder);
        } catch (error) {
            console.error('Ошибка при получении заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async updateIndividualOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const individualOrder = await IndividualOrder.findByPk(id);

            if (!individualOrder) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            const allowedStatuses = ['на рассмотрении', 'выполняется', 'выполнен', 'отменён'];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ message: 'Недопустимый статус заказа' });
            }

            individualOrder.status = status;
            await individualOrder.save();

            res.json(individualOrder);
        } catch (error) {
            console.error('Ошибка при обновлении статуса заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async updateIndividualOrderCompletionTime(req, res) {
        try {
            const { id } = req.params;
            const { completion_time } = req.body;

            const individualOrder = await IndividualOrder.findByPk(id);

            if (!individualOrder) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            const bakeryId = req.user.bakeryId;
            if (individualOrder.bakeryId !== bakeryId) {
                return res.status(403).json({ message: 'У вас нет прав для обновления этого заказа.' });
            }

            individualOrder.completion_time = completion_time;
            await individualOrder.save();

            res.json({ message: 'Время выполнения заказа обновлено.', individualOrder });
        } catch (error) {
            console.error('Ошибка при обновлении времени выполнения заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async updateIndividualOrderTotalCost(req, res) {
        try {
            const { id } = req.params;
            const { total_cost } = req.body;

            const individualOrder = await IndividualOrder.findByPk(id);

            if (!individualOrder) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            const bakeryId = req.user.bakeryId;
            if (individualOrder.bakeryId !== bakeryId) {
                return res.status(403).json({ message: 'У вас нет прав для обновления этого заказа.' });
            }

            individualOrder.total_cost = total_cost;
            await individualOrder.save();

            res.json({ message: 'Время выполнения заказа обновлено.', individualOrder });
        } catch (error) {
            console.error('Ошибка при обновлении времени выполнения заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async deleteIndividualOrder(req, res) {
        try {
            const { id } = req.params;

            const individualOrder = await IndividualOrder.findByPk(id);

            if (!individualOrder) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            if (individualOrder.userId !== req.user.userId) {
                return res.status(403).json({ message: 'Нет прав для удаления этого заказа' });
            }

            await individualOrder.destroy();

            res.status(200).json({ message: 'Заказ успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getBakeryIndividualOrders(req, res) {
        try {
            const bakeryId = req.user.bakeryId;
            console.log('Получение заказов для пекарни ID:', bakeryId);
            if (!bakeryId) {
                return res.status(401).json({ message: 'Неавторизованный пользователь' });
            }

            const bakery = await Bakery.findByPk(bakeryId);
            if (!bakery) {
                return res.status(404).json({ message: 'Пекарня не найдена' });
            }

            const individualOrder = await IndividualOrder.findAll({
                where: { bakeryId: bakery.id },
                include: [
                    {
                        model: User,
                        attributes: ['name', 'surname', 'phone'],
                    },
                ],
                order: [['date_of_ordering', 'DESC']],
            });

            res.json(individualOrder);
        } catch (error) {
            console.error('Ошибка при получении заказов пекарни:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new IndividualOrderController();
