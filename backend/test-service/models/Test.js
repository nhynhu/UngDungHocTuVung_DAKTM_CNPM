const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Test = sequelize.define('Test', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    topicIds: { type: DataTypes.JSON, allowNull: false }
});

module.exports = Test;