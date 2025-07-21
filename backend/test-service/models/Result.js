const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Result = sequelize.define('Result', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    testId: { type: DataTypes.INTEGER, allowNull: false },
    score: { type: DataTypes.INTEGER, allowNull: false },
    totalQuestions: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Result;
