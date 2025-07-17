require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./models');
const Topic = require('./models/Topic');
const Word = require('./models/Word');
const topicRoutes = require('./routes/topicRoutes');
const wordRoutes = require('./routes/wordRoutes');

const app = express();
app.use(cors());
app.use(express.json());

Topic.hasMany(Word);
Word.belongsTo(Topic);

app.use('/topics', topicRoutes);
app.use('/words', wordRoutes);

sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => console.log(`Topic service on port ${process.env.PORT}`));
});