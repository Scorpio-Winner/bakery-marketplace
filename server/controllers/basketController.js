const { Basket, BasketItem, Product, Order } = require('../models/models');

class BasketController {
  async createOrUpdateBasket(req, res) {
    const { userId } = req.params;

    try {
      let basket = await Basket.findOne({ where: { UserId: userId } });

      if (!basket) {
        // Если корзина не существует, создаем новую
        basket = await Basket.create({ UserId: userId });
      }

      return res.status(200).json({ basket });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  async addProductToBasket(req, res) {
    const { basketId, productId, quantity } = req.body;

    try {
      const basket = await Basket.findByPk(basketId);
      const product = await Product.findByPk(productId);

      if (!basket || !product) {
        return res.status(404).json({ error: 'Корзина или продукт не найдены' });
      }

      await basket.addProduct(product, { through: { quantity } });

      return res.status(200).json({ message: 'Товар добавлен в корзину' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  async removeProductFromBasket(req, res) {
    const { basketId, productId } = req.params;

    try {
      const basket = await Basket.findByPk(basketId);
      const product = await Product.findByPk(productId);

      if (!basket || !product) {
        return res.status(404).json({ error: 'Корзина или продукт не найдены' });
      }

      await basket.removeProduct(product);

      return res.status(200).json({ message: 'Товар удален из корзины' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  async updateOrderStatus(req, res) {
    const { orderId } = req.params;
  
    try {
      const order = await Order.findByPk(orderId, { include: Basket });
  
      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }
  
      order.status = 'Сформирован'; // Изменяем статус заказа на "Сформирован"
      await order.save();
  
      await BasketItem.destroy({ where: { BasketId: order.Basket.id } }); // Очищаем все записи BasketItem, связанные с корзиной
  
      return res.status(200).json({ message: 'Статус заказа обновлен, корзина очищена' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
}

module.exports = new BasketController();