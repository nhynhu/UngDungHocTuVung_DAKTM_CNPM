const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Question = sequelize.define('Question', {
    content: { type: DataTypes.STRING, allowNull: false },
    options: { type: DataTypes.JSON, allowNull: false }, // Array of 4 options
    answer: { type: DataTypes.INTEGER, allowNull: false }, // Index of correct answer (0-3)
    topicId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Question;