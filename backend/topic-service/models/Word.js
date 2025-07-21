const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');   // <-- destructure đúng

const Word = sequelize.define('Word', {
    english: { type: DataTypes.STRING, allowNull: false },
    vietnamese: { type: DataTypes.STRING, allowNull: false },
    TopicId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Word;