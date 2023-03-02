const Expense = require('../models/expense');
const User = require('../models/User');

const sequelize = require("sequelize");

exports.getLeaderBoard = async (req, res, next) => {
    try {
        const userLeaderBoardDetails = await User.findAll({
            attributes: ['id','name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost']],
            include: [{
                model: Expense,
                attributes: []
            }],
            group:['users.id'],
            order:[['total_cost', 'DESC']]
        });
        res.status(200).json(userLeaderBoardDetails);
        }   catch (error) {
            console.log(error);
            res.status(500).json({error: error, success : false})
        }
}