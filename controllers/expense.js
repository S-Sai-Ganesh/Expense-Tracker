const Expense = require('../models/expense');
const User = require('../models/User');
const sequelize = require('../util/database');

exports.getExpenses = async (req, res, next) => {
    try{
    const all = await Expense.findAll({where: {userId: req.user.id}})
    // const all = await req.user.getExpenses()
        res.json(all);
    }catch(err) {
       console.log(err);
    }
}

exports.postExpense = async (req, res, next) => {
    const sequelizeTransaction = await sequelize.transaction(); 
    try{
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const data = await Expense.create({
            amount: amount,
            description:description,
            category:category,
            userId: req.user.id},
            {transaction: sequelizeTransaction}
        );

        const tExpense = +req.user.totalExpense + +amount;
        await User.update(
            { totalExpense: tExpense},
            {where: {id:req.user.id},
            transaction: sequelizeTransaction}
        )
        
        await sequelizeTransaction.commit();
        res.status(201).json( data);
    } catch (err) {
        await sequelizeTransaction.rollback();
        res.status(500).json({error:err})
    } 
}

exports.deleteExpense = async (req, res, next) => {
    const sequelizeTransaction = await sequelize.transaction();
    try{
        const expenseId = req.params.expenseId;
        const expenseField = await Expense.findByPk(expenseId, {where: { userId: req.user.id},transaction: sequelizeTransaction})
        await expenseField.destroy({transaction: sequelizeTransaction});
        
        const userTExpense = await User.findByPk(req.user.id,{
            attributes: ['totalExpense'],
            raw: true,
            transaction: sequelizeTransaction
        });
        
        const editedTotal = userTExpense.totalExpense - expenseField.dataValues.amount;
        await User.update({totalExpense: editedTotal},{where: {id:req.user.id}, transaction:sequelizeTransaction})

        await sequelizeTransaction.commit();
        res.status(201).json({delete: expenseField});
    } catch(err) {
        await sequelizeTransaction.rollback();
        console.error(err);
    }
}

exports.editExpense = async (req,res,next)=>{
    const sequelizeTransaction = await sequelize.transaction();
    try{
        const expenseId = req.params.expenseId;
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        const befExpense = await Expense.findByPk(expenseId,{
            attributes: ['amount'],
            raw: true,
            transaction: sequelizeTransaction
        });

        const chUser = await User.findByPk(req.user.dataValues.id,{
            attributes: ['totalExpense'],
            raw: true,
            transaction: sequelizeTransaction
        });

        const updatedExpense = +chUser.totalExpense - +befExpense.amount + +amount;
        const updatedUser = await User.update({
            totalExpense: updatedExpense
        },{where: {id:req.user.dataValues.id}, transaction: sequelizeTransaction})

        const data = await Expense.update({
            amount: amount,
            description:description,
            category:category
        },{where: {id:expenseId}, transaction: sequelizeTransaction});

        sequelizeTransaction.commit();
        res.status(201).json( data);
    } catch (err) {
        sequelizeTransaction.rollback();
        res.status(500).json({error:err})
    } 
}