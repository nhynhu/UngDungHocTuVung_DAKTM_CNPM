const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Topic = sequelize.define('Topic', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    image: { type: DataTypes.STRING }
});
module.exports = Topic;