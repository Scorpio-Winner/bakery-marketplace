const { TechnicalRequest } = require('../models/models');

class TechnicalRequestController {
    async create(req, res) {
        try {
            const { short_request, description, status, userId, bakeryId } = req.body;

            if (!short_request || !description) {
                return res.status(400).json({ message: 'Поля short_request и description обязательны' });
            }

            if (!userId && !bakeryId) {
                return res.status(400).json({ message: 'Должен быть указан либо userId, либо bakeryId' });
            }

            const request = await TechnicalRequest.create({
                short_request: short_request.trim(),
                description: description.trim(),
                status: status || 'на рассмотрении',
                userId: userId || null,
                bakeryId: bakeryId || null,
            });

            return res.status(201).json({ message: 'Обращение успешно создано', request });
        } catch (error) {
            console.error('Ошибка при создании обращения:', error);
            return res.status(500).json({ message: 'Ошибка сервера при создании обращения' });
        }
    }
}

module.exports = new TechnicalRequestController();
