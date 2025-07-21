const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Topic = sequelize.define(
    'Topic',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        nameVi: { type: DataTypes.STRING, allowNull: false, unique: true },
        image: { type: DataTypes.STRING, allowNull: true },
        description: { type: DataTypes.TEXT, allowNull: true }
    }
);

module.exports = Topic;