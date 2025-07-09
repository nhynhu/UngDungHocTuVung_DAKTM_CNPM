const { sequelize } = require('sequelize');
require('dotenv').config();
module.exports = new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: mysql
});
