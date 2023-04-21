const Forgotpassword = require('../models/forgotpassword');
const User = require('../models/User');
const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const bcrypt = require('bcrypt');

exports.postForgotPassword = async (req,res,next) => {
    try {
        const {email} = req.body;
        const userFound = await User.findOne({email:email});
        
        if(userFound){
            const id = uuid.v4();
            const forgotP = new Forgotpassword({ _id: id, active: true, userId: userFound._id });
            await forgotP.save();

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
                email: email
                }
            ]

            await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Reset Password',
                textContent: `Reset Password`,
                htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`
            });

            return res.status(201).json({success: true,message: 'Reset Mail Sent Successful'});
        } else {
            throw Error('User does not exist');
        }
    } catch(error) {
        console.log(error);
        res.status(404).json({success:false, error:error.message});
    }
}

exports.getResetPassword = async (req,res,next) => {
    const id = req.params.id;
    try {
    const forgotUser = await Forgotpassword.findOne({_id: id});
    if(forgotUser) {
        if(forgotUser.active) {
            res.status(201).send(`
            <html>                       
                <form action="/password/updatepassword/${id}" method="get">
                    <label for="newPassword">Enter New password</label>
                    <input name="newPassword" type="password" id="newPassword" required></input>
                    <button id='reset-btn'> Reset Password </button>
                </form>
            </html>
            `);
            res.end();
        } else {
            return res.status(404).json({success: false, error: 'Link expired'});
        }
    } else {
        throw new Error('Wrong reset password link');
    }
    } catch(error) {
        return res.status(404).json({success:false, error:error.message});
    }
}

exports.getUpdatePassword = async (req,res,next) => {
    const id = req.params.id;
    const newPassword = req.query.newPassword;
    try {
        const forgotUser = await Forgotpassword.findOne({_id:id});
        forgotUser.active = false;
        await forgotUser.save();

        bcrypt.hash(newPassword, 10, async (err, hash) => {
            if(err) console.log(err);
            const userr = await User.findOne({_id: forgotUser.userId});
            userr.password = hash;
            userr.save();
            res.status(201).json({ message: 'Succcessfully updated user password' });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}