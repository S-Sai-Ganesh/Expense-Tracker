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