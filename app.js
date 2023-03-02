const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const Expense = require('./models/expense');
const User = require('./models/User');
const Order = require('./models/order');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');

const app = express();

const cors = require('cors');
const sequelize = require('./util/database');
app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
    .sync()
    // .sync({ force: true })
    .then(res => {
        app.listen(3000, (err) => {
            if (err) console.log(err);
            console.log('Server is listening for requests');
        });
    })
    .catch(err => {
        console.log(err);
    })