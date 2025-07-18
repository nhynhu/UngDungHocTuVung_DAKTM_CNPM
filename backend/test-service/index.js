require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./models');
const Question = require('./models/Question');
const Result = require('./models/Result');
const Test = require('./models/Test');
const questionRoutes = require('./routes/questionRoute');
const resultRoutes = require('./routes/resultRoute');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/questions', questionRoutes);
app.use('/results', resultRoutes);
app.use('/tests', testRoutes);

sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => console.log(`Test service on port ${process.env.PORT}`));
});