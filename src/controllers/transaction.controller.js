const Transaction = require('../models/Transaction.model');
const { validationResult } = require('express-validator');

//GET /api/transactions
//Get all transactions for a user
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

//POST /api/transactions
//Add a new transaction
exports.addTransaction = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { date, description, amount, category, type } = req.body;

    try {
        const newTransaction = new Transaction({
            userId: req.user.id,
            date,
            description,
            amount,
            category,
            type
        });

        const transaction = await newTransaction.save();
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

//PUT /api/transactions/:id
//Update a transaction
exports.updateTransaction = async (req, res) => {
    const { date, description, amount, category, type } = req.body;

    const transactionFields = {};
    if (date) transactionFields.date = date;
    if (description) transactionFields.description = description;
    if (amount) transactionFields.amount = amount;
    if (category) transactionFields.category = category;
    if (type) transactionFields.type = type;

    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });

        if (transaction.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { $set: transactionFields },
            { new: true } 
        );

        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

//DELETE /api/transactions/:id
//Delete a transaction
exports.deleteTransaction = async (req, res) => {
    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });

        if (transaction.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Transaction.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Transaction removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};