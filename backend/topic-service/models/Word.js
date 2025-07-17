const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Word = sequelize.define('Word', {
    english: { type: DataTypes.STRING, allowNull: false },
    vietnamese: { type: DataTypes.STRING, allowNull: false }
});
module.exports = Word;