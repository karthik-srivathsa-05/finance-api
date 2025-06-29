const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const transactionController = require('../controllers/transaction.controller');

router.use(authMiddleware);

//GET /api/transactions
router.get('/', transactionController.getTransactions);

//GET /api/transactions/export
//Export transactions to CSV
router.get('/export', transactionController.exportTransactions);

//POST /api/transactions
router.post(
    '/',
    [
        check('description', 'Description is required').not().isEmpty(),
        check('amount', 'Amount is required and must be a number').isNumeric(),
        check('date', 'Date is required').isISO8601().toDate(),
        check('type', 'Type must be either Income or Expense').isIn(['Income', 'Expense'])
    ],
    transactionController.addTransaction
);

//PUT /api/transactions/:id
router.put('/:id', transactionController.updateTransaction);

//DELETE /api/transactions/:id
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;