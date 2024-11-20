const { User, Bakery } = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email: email } });
            const bakery = await Bakery.findOne({ where: { email: email } });


            console.log('User:', user);
            console.log('Bakery:', bakery);

            if (!user && !bakery) {
                return res.status(401).json({ error: "Authentication failed" });
            }

            if (user) {
                const passwordMatch = await bcrypt.compare(password, user.password);

                if (!passwordMatch) {
                    return res.status(401).json({ error: "Authentication failed" });
                }

                const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
                    expiresIn: "5h",
                });

                res.status(200).json({ accessToken: token, role: "user", id: user.id, refreshToken: token });
            } else if (bakery){
                const passwordMatch = await bcrypt.compare(password, bakery.password);

                if (!passwordMatch) {
                    return res.status(401).json({ error: "Authentication failed" });
                }

                const token = jwt.sign({ bakeryId: bakery.id }, process.env.SECRET_KEY, {
                    expiresIn: "5h",
                });

                res.status(200).json({ accessToken: token, role: "bakery", id: bakery.id, refreshToken: token });
            }
        } catch (error) {
            res.status(500).json({ error: "Login failed" });
        }
    }

    async checkEmail(req, res) {
        try {
            const { email } = { ...req.body };

            const user = await User.findOne({ where: { email: email } });
            const bakery = await Bakery.findOne({ where: { email: email } });

            if (!user && !bakery) {
                return res.status(200).json({ available: true });
            }

            return res.status(200).json({ available: false });
        } catch (error) {
            res.status(500).json({ error: "Проверка почты провалилась" });
        }
    }
}

module.exports = new AuthController();