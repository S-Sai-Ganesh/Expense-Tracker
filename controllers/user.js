const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        bcrypt.hash(password, 10, async (err, hash) => {
            if(err) console.log(err);
            await User.create({ name, email, password: hash });
            res.status(201).json({ message: 'Succcessfully created new user' });
        });

    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(500).json({ error: err.errors[0].message });
        } else {
            res.status(500).json({ error: err });
        }
    }
};

function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, name: name}, 'mysecretkey.987654321');
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
                    res.status(200).json({ message: 'User logged in successfully', success: true, token: generateAccessToken(userExist[0].dataValues.id, userExist[0].dataValues.name) });
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