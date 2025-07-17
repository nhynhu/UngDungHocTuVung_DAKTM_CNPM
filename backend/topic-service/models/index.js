const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_NAME || 'topics_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'root',
    {
        host: process.env.DB_HOST || 'db-topics',
        dialect: 'mysql'
    }
);
module.exports = sequelize;