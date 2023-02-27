const express = require('express');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.get('/get-expenses', expenseController.getExpenses);

router.post('/post-expense', expenseController.postExpense);

router.get('/delete-expense/:expenseId', expenseController.deleteExpense);

router.post('/edit-expense/:expenseId', expenseController.editExpense);

module.exports = router;