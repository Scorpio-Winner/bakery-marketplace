const { Order, Basket, Product } = require('../models/models');
const { Op } = require('sequelize');


class OrderController {
  async createOrder(req, res) {
    const { userId, name, delivery_address, total_cost, description, date_of_ordering } = req.body;
  
    try {
      const order = await Order.create({ 
        userId: userId, 
        name,
        delivery_address,
        total_cost,
        status: 'Сформирован',
        description,
        date_of_ordering
      });
  
      return res.status(201).json({ order });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll();
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'Заказы не найдены' });
      }
  
      return res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ошибка сервера при поиске заказов' });
    }
  }
  


  async getCompletedOrders(req, res) {
    const  userId  = req.params.id;
  
    try {
      const orders = await Order.findAll({
        where: {
          userId: userId,
          status: { [Op.or]: ['Выполнен', 'Отменен'] } // Используем оператор [Op.or] для поиска по разным статусам
        }
      });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'Заказы не найдены для данного пользователя и статуса' });
      }
  
      return res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ошибка сервера при поиске заказов' });
    }
  }

  async getInProcessOrders(req, res) {
    const  userId  = req.params.id;
  
    try {
      const orders = await Order.findAll({
        where: {
          userId: userId,
          status: { [Op.or]: ['В процессе', 'Сформирован'] } // Используем оператор [Op.or] для поиска по разным статусам
        }
      });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'Заказы не найдены для данного пользователя и статуса' });
      }
  
      return res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ошибка сервера при поиске заказов' });
    }
  }

  async getAllCompletedOrders(req, res) {
    try {
      const orders = await Order.findAll({
        where: {
          status: { [Op.or]: ['Выполнен', 'Отменен'] } // Используем оператор [Op.or] для поиска по разным статусам
        }
      });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'Заказы не найдены для данного пользователя и статуса' });
      }
  
      return res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ошибка сервера при поиске заказов' });
    }
  }

  async getAllInProcessOrders(req, res) {
  
    try {
      const orders = await Order.findAll({
        where: {
          status: { [Op.or]: ['В процессе', 'Сформирован'] } // Используем оператор [Op.or] для поиска по разным статусам
        }
      });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'Заказы не найдены для данного пользователя и статуса' });
      }
  
      return res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ошибка сервера при поиске заказов' });
    }
  }
  
  
  

  async getOrder(req, res) {
    const { orderId } = req.params;

    try {
      const order = await Order.findByPk(orderId, { include: Product });

      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }

      return res.status(200).json({ order });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll({ include: Product });

      return res.status(200).json({ orders });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  async updateOrderStatusInProgress(req, res) {
    const orderId  = req.params.id;
    const { completion_time, adminId } = req.body;

    try {
      const order = await Order.findOne({ where: { id: orderId } });

      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }

      order.status = 'В процессе';
      order.completion_time = completion_time;
      order.adminId = adminId;
      await order.save();

      return res.status(200).json({ message: 'Статус заказа обновлен' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }



  async update(req, res) {
    const { id } = req.params;

    const user = { ...req.body };

    if (isNaN(id) || parseInt(id) !== user.id) {
      return res.sendStatus(400);
    }

    try {


      const existingUser = await User.findOne({ where: { id: id } });

      if (existingUser == null) {
        return res.sendStatus(404);
      }

      if (user.email !== existingUser.email) {
        if ((await User.findOne({ where: { email: user.email } })) !== null) {
          return res.status(400).json({ error: "Email is taken" });
        }
      }

     // user.password = await bcrypt.hash(user.password, 10);

      await User.update(user, { where: { id: id } });

      return res.sendStatus(204);
    } catch (err) {

      console.log(err);
      return res.sendStatus(500);
    }
  }

  async updateOrderStatusCancelled(req, res) {
    const { id } = req.params;
  
    try {
      const orderId = parseInt(id);
  
      let order = await Order.findOne({ where: { id: orderId } });
  
      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }
  
      order.status = 'Отменен';
      await order.save();
  
      return res.status(200).json({ message: 'Статус заказа обновлен' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }


  async updateOrderStatusCompleted(req, res) {
    const { id } = req.params;
  
    try {
      const orderId = parseInt(id);
  
      let order = await Order.findOne({ where: { id: orderId } });
  
      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }
  
      order.status = 'Выполнен';
      await order.save();
  
      return res.status(200).json({ message: 'Статус заказа обновлен' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
  
  

  // async updateOrderStatusCompleted(req, res) {
  //   const { orderId } = req.params;

  //   try {
  //     const order = await Order.findByPk(orderId);

  //     if (!order) {
  //       return res.status(404).json({ error: 'Заказ не найден' });
  //     }

  //     order.status = 'Выполнен';
  //     await order.save();

  //     return res.status(200).json({ message: 'Статус заказа обновлен' });
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(500).json({ error: 'Ошибка сервера' });
  //   }
  // }
}

module.exports = new OrderController();