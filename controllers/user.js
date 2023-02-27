const User = require('../models/User');

exports.postUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const data = await User.create({
            name: name,
            email: email,
            password: password
        });
        console.log(data);
        res.status(201).json({ signupUser: data });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(500).json({ error: err.errors[0].message });
        } else {
            res.status(500).json({ error: err });
        }
    }
};

exports.postLogin = async (req, res, next) => {
    try {
        const email = req.body.email;
        const loginPassword = req.body.password;

        const userExist = await User.findAll({ where: { email: email } })

        if (userExist && userExist.length) {
            if (userExist[0].dataValues.password == loginPassword) {
                res.status(201).json({ message: 'User logged in successfully', success: 'true' });
            } else {
                res.status(401).json({ error: "User not authorized. Wrong password" })
            }
        } else {
            res.status(404).json({ error: "User doesnot exist. Try with different email" })
        }
    } catch (err) {
        console.log(err);
    }
}