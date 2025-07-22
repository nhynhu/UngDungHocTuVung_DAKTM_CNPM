const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
);

const Topic = require('./Topic')(sequelize);
const Word = require('./Word')(sequelize);

Topic.hasMany(Word, { foreignKey: 'TopicId', as: 'words' });
Word.belongsTo(Topic, { foreignKey: 'TopicId', as: 'topic' });

module.exports = { sequelize, Topic, Word };