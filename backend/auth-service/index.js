require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./models');
const userRoutes = require('./routes/userRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);

sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => console.log(`User service on port ${process.env.PORT}`));
});