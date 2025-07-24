import express from 'express';
import TransactionsController from './transactions.controller.js';
import wrapper from '../shared/wrapper.js';

const router = express.Router();
const transactionsController = new TransactionsController();

// User routes
router.post('/transfer', wrapper(transactionsController.transfer));
router.get('/history', wrapper(transactionsController.getHistory));

// Admin routes
router.get('/all', wrapper(transactionsController.getAllTransactions));

export default router;