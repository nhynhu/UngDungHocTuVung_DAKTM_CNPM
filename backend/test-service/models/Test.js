const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Test = sequelize.define('Test', {
    name: { type: DataTypes.STRING, allowNull: false },
    topicIds: { type: DataTypes.JSON, allowNull: false }
});

module.exports = Test;