const sequelize = require('../config/db.config');
const User = require('./user');
const Topic = require('./topic');
const Word = require('./word');

Topic.hasMany(Word, { foreignKey: 'topicId' });
Word.belongsTo(Topic, { foreignKey: 'topicId' });

module.exports = { sequelize, User, Topic, Word };