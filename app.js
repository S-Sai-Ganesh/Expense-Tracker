const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const forgotpasswordRoutes = require('./routes/forgotpassword');

const app = express();
app.use(cors({origin : 'null'}));
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', forgotpasswordRoutes);

mongoose
    .connect('mongodb+srv://mongodbusername:OYYhMshMIuAnpIb8@cluster0.vtzjy7t.mongodb.net/expense?retryWrites=true&w=majority')
    .then(result=>{
        app.listen(process.env.PORT_DEFAULT);
        console.log('Server Listening!');
    })
    .catch(err=> console.log(err));