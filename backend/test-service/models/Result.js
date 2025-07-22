const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Result = sequelize.define('Result', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    score: { type: DataTypes.INTEGER, allowNull: false },
    totalQuestions: { type: DataTypes.INTEGER, allowNull: false },
    // SỬA LỖI: Định nghĩa TestId trực tiếp trong model
    TestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Tests',
            key: 'id'
        }
    },
    timeTaken: { type: DataTypes.INTEGER, allowNull: false },
    pass: { type: DataTypes.BOOLEAN, allowNull: true }
});

module.exports = Result;
