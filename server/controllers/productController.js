const { Product } = require('../models/models');
const path = require("path");
const fs = require("fs");

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await Product.findAll();
      return res.json(products);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  async getProduct(req, res) {
    const { productId } = req.params;

    try {
      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({ error: 'Продукт не найден' });
      }

      return res.status(200).json({ product });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  async getAvatar(req, res) {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        const imagePath = path.join(__dirname, "../", "avatars", "product", id + ".png");

        if (!fs.existsSync(imagePath)) {
            return res.sendStatus(204);
        }

        return res.sendFile(imagePath);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}
}

module.exports = new ProductController();