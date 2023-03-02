const Expense = require('../models/expense');
const User = require('../models/User');

const sequelize = require("sequelize");

exports.getLeaderBoard = async (req, res, next) => {
    try {
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggregatedExpenses = [];

        expenses.forEach(expense => {
            
            if(userAggregatedExpenses[expense.userId]){
                userAggregatedExpenses[expense.userId] += expense.amount;
            } else {
                userAggregatedExpenses[expense.userId] = expense.amount;
            }
        });
        const userLeaderBoardDetails = [];
        users.forEach((user)=>{
            userLeaderBoardDetails.push({name: user.name, total_cost: userAggregatedExpenses[user.id] || 0})
        });

        userLeaderBoardDetails.sort((a,b)=> b.total_cost - a.total_cost)
        res.status(200).json(userLeaderBoardDetails);
        }   catch (error) {
            console.log(error);
            res.status(500).json({error: error, success : false})
        }
}