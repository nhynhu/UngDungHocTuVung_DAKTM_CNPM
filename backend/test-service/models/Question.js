const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Question = sequelize.define('Question', {
    content: { type: DataTypes.STRING, allowNull: false },
    options: { type: DataTypes.JSON, allowNull: false },
    answer: { type: DataTypes.STRING, allowNull: false },
    topicId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Question;