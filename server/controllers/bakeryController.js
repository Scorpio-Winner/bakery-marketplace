const { Bakery } = require('../models/models');
const bcrypt = require("bcrypt");

class BakeryController {
  async getAll(req, res) {
    try {
      const admins = await Admin.findAll({
        attributes: { exclude: ['password'] },
      });

      return res.json(admins);
    } catch (err) {
      return res.sendStatus(500);
    }
  }

  async getOne(req, res) {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.sendStatus(400);
    }

    try {
      const admin = await Admin.findOne({
        where: { id: id },
        attributes: { exclude: ['password'] },
      });

      if (admin === null) {
        return res.sendStatus(404);
      }

      return res.json(admin);
    } catch (err) {
      return res.sendStatus(500);
    }
  }


  async getProfile(req, res) {
    const id = req.adminId;

    if (isNaN(id)) {
      return res.sendStatus(400);
    }

    try {
      const user = await Admin.findOne({
        where: { id: id },
        attributes: { exclude: ["password"] },
      });

      if (user == null) {
        return res.sendStatus(404);
      }

      return res.json(user);
    } catch (err) {
      return res.sendStatus(500);
    }
  }

  async create(req, res) {
    try {
      const bakery = { ...req.body };
  
      if (await Bakery.findOne({ where: { email: bakery.email } })) {
        return res.status(400).json({ error: "Email is taken" });
      }
  
      bakery.password = await bcrypt.hash(bakery.password, 10);
  
      const createdBakery = await Bakery.create(bakery);
  
      return res.status(201).json(createdBakery);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }
}


module.exports = new BakeryController();