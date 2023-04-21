const User = require('../models/User');

exports.getLeaderBoard = async (req, res, next) => {
    try {
        const userLeaderBoardDetails = await User.find()
        .sort({'totalExpense': 'desc'});
        res.status(200).json(userLeaderBoardDetails);
        }   catch (error) {
            console.log(error);
            res.status(500).json({error: error, success : false})
        }
}