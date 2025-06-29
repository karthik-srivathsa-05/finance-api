const Transaction = require('../models/Transaction.model');
const { validationResult } = require('express-validator');
const { Parser } = require('json2csv');

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

//GET /api/transactions
//Get all transactions for a user, with optional filtering
// @access  Private
exports.getTransactions = async (req, res) => {
    try {
        //base query to find transactions
        const query = { userId: req.user.id };

        const { startDate, endDate, category, description, type } = req.query;

        //building filter object
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (category) {
            query.category = category;
        }
        if (description) {
            query.description = { $regex: description, $options: 'i' };
        }
        if (type) {
            query.type = type;
        }

        const transactions = await Transaction.find(query).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

//GET /api/transactions/export
//Export user's transactions to a CSV file
// @access  Private
exports.exportTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });

        if (transactions.length === 0) {
            return res.status(404).json({ msg: 'No transactions found to export.' });
        }

        //define the fields for CSV file
        const fields = ['date', 'description', 'category', 'type', 'amount'];
        const opts = { fields };

        const parser = new Parser(opts);
        const csv = parser.parse(transactions);

        res.header('Content-Type', 'text/csv');
        res.attachment('transactions.csv');
        res.status(200).send(csv);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};