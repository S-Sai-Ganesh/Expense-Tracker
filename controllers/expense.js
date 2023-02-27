const Expense = require('../models/expense');

exports.getExpenses = async (req, res, next) => {
    try{
    const all = await Expense.findAll()
        res.json(all);
    }catch(err) {
       console.log(err);
    }
}

exports.postExpense = async (req, res, next) => {
    try{
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const data = await Expense.create({
        amount: amount,
        description:description,
        category:category
    });
    res.status(201).json( data);
    } catch (err) {
        res.status(500).json({error:err})
    } 
}

exports.deleteExpense = async (req, res, next) => {
    try{
        const expenseId = req.params.expenseId;
        const expenseField = await Expense.findByPk(expenseId)
        await expenseField.destroy();
        res.status(201).json({delete: expenseField})
    } catch(err) {
        console.error(err);
    }
}

exports.editExpense = async (req,res,next)=>{
    try{
    const expenseId = req.params.expenseId;
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const data = await Expense.update({
        amount: amount,
        description:description,
        category:category
    },{where: {id:expenseId}});
    res.status(201).json( data);
    } catch (err) {
        res.status(500).json({error:err})
    } 
}