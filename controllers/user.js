const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const userExist = await User.find({ email: email });
        if(userExist && userExist.length) return res.status(409).json({message: 'User already exist'});

        bcrypt.hash(password, 10, async (err, hash) => {
            if(err) console.log(err);
            const userr = new User({ name, email, password:hash, isPremiumUser: false, totalExpense: 0 });
            await userr.save();
            res.status(201).json({ message: 'Succcessfully created new user' });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

exports.generateAccessToken=(id, name, isPremiumUser) => {
    return jwt.sign({ userId: id, name: name, isPremiumUser:isPremiumUser}, process.env.TOKEN_SECRET);
}

exports.postLogin = async (req, res, next) => {
    try {
        const email = req.body.email;
        const loginPassword = req.body.password;

        const userExist = await User.find({ email: email });

        if (userExist && userExist.length) {
            bcrypt.compare(loginPassword, userExist[0].password, (err, result) => {
                if (err) {
                    throw new Error('Something went wrong');
                }
                if (result) {
                    res.status(200).json({ message: 'User logged in successfully', 
                    success: true, 
                    token: exports.generateAccessToken(userExist[0]._id, userExist[0].name, userExist[0].isPremiumUser )});
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