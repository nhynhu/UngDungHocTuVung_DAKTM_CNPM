const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'test_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '0000',
    {
        host: process.env.DB_HOST || 'db-tests',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
    }
);

module.exports = { sequelize };