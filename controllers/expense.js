const Expense = require('../models/expense');
const User = require('../models/User');
const DownloadUrl = require('../models/downloadUrl');
const S3services = require('../services/S3services'); 
const mongoose = require('mongoose');

exports.getDownloadExpenses = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const expenses = await Expense.find({userId: userId});
        console.log('expensesget>>>',expenses);
        const stringExpenses = JSON.stringify(expenses);
        console.log(stringExpenses);
        const filename = `${userId}Expense${new Date()}.txt`;
        const fileURL = await S3services.uploadToS3(stringExpenses,filename); 
        console.log('filllee Url>>>>>>',fileURL);

        const downloadUrlData = new DownloadUrl({fileURL,filename,userId});
        await downloadUrlData.save();

        res.status(200).json({fileURL, downloadUrlData, success:true});
    } catch(err) {
        console.log(err);
        res.status(500).json({err,success:false,fileURL:''})
    }
}


exports.getDownloadAllUrl = async(req,res,next) => {
    try {
        let urls = await DownloadUrl.find({userId: req.user._id});
        if(!urls){
            res.sttus(404).json({ message: 'no urls found'})
        }
        res.status(200).json({ urls, success: true})
    } catch (error) {
        res.status(500).json({error})
    }
}

exports.getExpenses = async (req, res, next) => {
    try{
        let page = req.params.pageNo || 1;
        let Items_Per_Page = +req.query.perpage;
        let offset = (page-1)*Items_Per_Page;

        const totalItems = await Expense.countDocuments({userId: req.user._id});
        const data = await Expense.find({userId: req.user._id}).skip(offset).limit(Items_Per_Page);

        res.status(200).json({
            data,
            info: {
                currentPage: page,
                hasNextPage: totalItems > page * Items_Per_Page,
                hasPreviousPage: page > 1,
                nextPage: +page + 1,
                previousPage: +page - 1,
                lastPage: Math.ceil(totalItems / Items_Per_Page) 
            }
        });
    }catch(err) {
       console.log(err);
       res.status(500).json({err});
    }
}

exports.postExpense = async (req, res, next) => {
    try{
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const data = new Expense({
            amount: amount,
            description:description,
            category:category,
            userId: req.user.id
        });
        await data.save();

        const tExpense = +req.user.totalExpense + +amount;

        const userr = await User.findById({_id:req.user.id} );
        userr.totalExpense = tExpense;
        userr.save();

        res.status(201).json( data);
    } catch (err) {
        res.status(500).json({error:err})
    } 
}

exports.deleteExpense = async (req, res, next) => {
    try{
        const expenseId = req.params.expenseId;
        const expenseField = await Expense.findById({_id:expenseId})
        await Expense.deleteOne({_id:expenseId});
        
        const userTExpense = await User.findById({_id:req.user.id}).select('totalExpense');
        
        const editedTotal = userTExpense.totalExpense - expenseField.amount;
        const userr = await User.findById({_id:req.user.id});
        userr.totalExpense = editedTotal;
        userr.save();

        res.status(201).json({delete: expenseField});
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

        const befExpense = await Expense.findById(expenseId);

        const chUser = await User.findById(req.user._id);

        const updatedExpense = +chUser.totalExpense - +befExpense.amount + +amount;
        chUser.totalExpense = updatedExpense;
        await chUser.save();

        befExpense.amount = amount;
        befExpense.description = description;
        befExpense.category = category;
        await befExpense.save();

        res.status(201).json({message: 'Success'});
    } catch (err) {
        res.status(500).json({error:err})
    } 
}