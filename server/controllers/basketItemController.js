const { BasketItem } = require('../models/models');

class BasketItemController {
  
    async setProductToBasket(req, res) {
        const { basketId, productId, quantity } = req.body;

        try {
            // Проверяем, существует ли запись с таким basketId и productId
            const existingBasketItem = await BasketItem.findOne({
                where: {
                    basketId: basketId,
                    productId: productId,
                },
            });

            if (existingBasketItem) {
                return res.status(400).json({ error: 'Запись уже существует' });
            }

            // Создаем новую запись в таблице BasketItem
            const newBasketItem = await BasketItem.create({
                basketId,
                productId,
                quantity,
            });

            return res.status(201).json(newBasketItem);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }

    async getProductToOrderForm(req, res) {
        const  basketId  = req.params.id;
        try {
            const orderProducts = await BasketItem.findAll({ where: { basketId : basketId } });

            if (!orderProducts || orderProducts.length === 0) {
            return res.status(404).json({ message: 'Продукты не найдены для данной корзины' });
            }

            return res.status(200).json( orderProducts );
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера при поиске продуктов для данной корзины' });
        }
    }

    async deleteItemsByBasketId(req, res) {
        const { basketId } = req.params;
    
        try {
          const deletedItems = await BasketItem.destroy({
            where: {
              basketId: basketId,
            },
          });
    
          if (deletedItems === 0) {
            return res.status(404).json({ message: 'Нет записей для удаления' });
          }
    
          return res.status(200).json({ message: `Успешно удалено ${deletedItems} записей` });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Ошибка сервера при удалении записей' });
        }
    }
}

  
  module.exports = new BasketItemController();