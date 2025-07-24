import Transaction from './transactions.model.js';

class TransactionsRepository {
    async create(transactionData) {
        const transaction = new Transaction(transactionData);
        await transaction.save();
        return transaction;
    }

    async findByUserId(userId) {
        return await Transaction.find({
            $or: [{ fromUserId: userId }, { toUserId: userId }]
        })
        .populate('fromUserId', 'fullName email')
        .populate('toUserId', 'fullName email')
        .sort({ createdAt: -1 });
    }

    async findAll() {
        return await Transaction.find({})
            .populate('fromUserId', 'fullName email')
            .populate('toUserId', 'fullName email')
            .sort({ createdAt: -1 });
    }

    async findById(id) {
        return await Transaction.findById(id)
            .populate('fromUserId', 'fullName email')
            .populate('toUserId', 'fullName email');
    }

    async getUserTransactionHistory(userId) {
        const transactions = await this.findByUserId(userId);
        
        // Format transactions to show positive/negative amounts
        return transactions.map(transaction => {
            const isOutgoing = transaction.fromUserId._id.toString() === userId.toString();
            const otherUser = isOutgoing ? transaction.toUserId : transaction.fromUserId;
            
            return {
                _id: transaction._id,
                amount: isOutgoing ? -transaction.amount : transaction.amount,
                otherUser: {
                    fullName: otherUser.fullName,
                    email: otherUser.email
                },
                type: isOutgoing ? 'sent' : 'received',
                description: transaction.description,
                status: transaction.status,
                createdAt: transaction.createdAt
            };
        });
    }
}

export default TransactionsRepository;