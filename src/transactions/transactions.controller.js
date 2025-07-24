import TransactionsRepository from './transactions.repository.js';
import UsersRepository from '../users/users.repository.js';

class TransactionsController {
    constructor() {
        this.transactionsRepo = new TransactionsRepository();
        this.usersRepo = new UsersRepository();
    }

    transfer = async (req, res) => {
        console.log('inside transfer');

        const { recipientEmail, amount, description } = req.body;
        const senderId = req.session.userId;

        // Validate input
        if (!recipientEmail || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Recipient email and amount are required'
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than zero'
            });
        }

        // Get sender
        const sender = await this.usersRepo.findById(senderId);
        if (!sender) {
            return res.status(404).json({
                success: false,
                message: 'Sender not found'
            });
        }

        // Get recipient
        const recipient = await this.usersRepo.findByEmail(recipientEmail);
        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: 'Recipient not found'
            });
        }

        // Check if sender is trying to send to themselves
        if (sender._id.toString() === recipient._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot transfer money to yourself'
            });
        }

        // Check if recipient is active
        if (!recipient.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Recipient account is not active'
            });
        }

        // Check sender balance
        if (sender.balance < amount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient balance'
            });
        }

        // Update balances
        sender.balance -= amount;
        recipient.balance += amount;

        await sender.save();
        await recipient.save();

        // Create transaction record
        const transaction = await this.transactionsRepo.create({
            fromUserId: sender._id,
            toUserId: recipient._id,
            amount: amount,
            description: description || 'Money transfer'
        });

        res.json({
            success: true,
            message: 'Transfer completed successfully',
            transaction: {
                id: transaction._id,
                amount: amount,
                recipient: {
                    fullName: recipient.fullName,
                    email: recipient.email
                },
                description: transaction.description,
                createdAt: transaction.createdAt
            },
            newBalance: sender.balance
        });

    };
    getHistory = async (req, res) => {

        const userId = req.session.userId;
        const transactions = await this.transactionsRepo.getUserTransactionHistory(userId);

        res.json({
            success: true,
            transactions: transactions
        });

    };

    getAllTransactions = async (req, res) => {
        // Check if user is admin
        if (req.session.userRole !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        const transactions = await this.transactionsRepo.findAll();

        res.json({
            success: true,
            transactions: transactions
        });

    };
}

export default TransactionsController;