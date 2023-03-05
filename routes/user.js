const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/signup', userController.postUser);

router.post('/login', userController.postLogin);

router.post('/password/forgotpassword', userController.postForgotPassword);

module.exports = router;