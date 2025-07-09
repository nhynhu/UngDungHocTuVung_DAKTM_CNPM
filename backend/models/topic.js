const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Topic = sequelize.define('Topic', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
});
module.exports = Topic;