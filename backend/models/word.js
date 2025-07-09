const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Word = sequelize.define('Word', {
    word: { type: DataTypes.STRING, allowNull: false },
    meaning: { type: DataTypes.TEXT, allowNull: false },
    topicId: { type: DataTypes.INTEGER, allowNull: false }
});
module.exports = Word;