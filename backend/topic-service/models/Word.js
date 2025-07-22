const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Word', {
        english: {
            type: DataTypes.STRING,
            allowNull: false
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
};