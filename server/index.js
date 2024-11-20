
require("dotenv").config();
const express = require("express");
const sequelize = require("./models/index");
const models = require('./models/models')
const router = require('./routers/index')

const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();


app.use(cors())
app.use(express.json())
app.use(router)

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });


const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
        
    } catch (e) {
        console.log(e);
    }
};

start();