const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

exports.postUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        bcrypt.hash(password, 10, async (err, hash) => {
            if(err) console.log(err);
            await User.create({ name, email, password: hash, isPremiumUser: false, totalExpense: 0 });
            res.status(201).json({ message: 'Succcessfully created new user' });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

exports.generateAccessToken=(id, name, isPremiumUser) => {
    return jwt.sign({ userId: id, name: name, isPremiumUser:isPremiumUser}, 'mysecretkey.987654321');
}

exports.postLogin = async (req, res, next) => {
    try {
        const email = req.body.email;
        const loginPassword = req.body.password;

        const userExist = await User.findAll({ where: { email: email } });
        console.log(userExist);

        if (userExist && userExist.length) {
            bcrypt.compare(loginPassword, userExist[0].dataValues.password, (err, result) => {
                if (err) {
                    throw new Error('Something went wrong');
                }
                if (result) {
                    res.status(200).json({ message: 'User logged in successfully', 
                    success: true, 
                    token: exports.generateAccessToken(userExist[0].dataValues.id, userExist[0].dataValues.name, userExist[0].dataValues.isPremiumUser )});
                } else {
                    res.status(401).json({ error: "User not authorized. Wrong password", success: false });
                }
            })
        } else {
            res.status(404).json({ error: "User doesnot exist. Try with different email", success: false });
        }
    } catch (err) {
        res.status(500).json({ error: err, success: false })
    }
}


exports.postForgotPassword = async (req,res,next) => {
    try {

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key']
        apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'ganeshsai29101@gmail.com',
            name: 'Sai Ganesh'
        }

        const receivers = [
            {
            email: `${req.body.email}`
            }
        ]

        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset Password',
            textContent: `Reset Password`
        }).then(res=>console.log(res)).catch(err=>console.log(err))
        res.status(201).json({success: true,message: 'Reset Password Success'})
    } catch(err) {
        console.log(err);
    }
}