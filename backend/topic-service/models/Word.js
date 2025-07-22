const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Word = sequelize.define('Word', {
    english: {
        type: DataTypes.STRING,
        allowNull: false
        // SỬA LỖI: Bỏ unique constraint để giảm số lượng key
        // unique: true 
    },
    vietnamese: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    TopicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Topics',
            key: 'id'
        }
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['TopicId', 'english']
        }
    ]
});

module.exports = Word;