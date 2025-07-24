import User from './users.model.js';

class UsersRepository {
    async create(userData) {
        const user = new User(userData);
        await user.save();
        return user;
    }

    async findByEmail(email) {
        return await User.findOne({ email: email.toLowerCase() });
    }

    async findById(id) {
        return await User.findById(id);
    }

    async findAll() {
        return await User.find({});
    }

    async updateBalance(userId, newBalance) {
        return await User.findByIdAndUpdate(
            userId,
            { balance: newBalance },
            { new: true }
        );
    }

    async deactivateUser(userId) {
        return await User.findByIdAndUpdate(
            userId,
            { isActive: false },
            { new: true }
        );
    }

    async activateUser(userId) {
        return await User.findByIdAndUpdate(
            userId,
            { isActive: true },
            { new: true }
        );
    }

    async addBalance(userId, amount) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        
        user.balance += amount;
        await user.save();
        return user;
    }
}

export default UsersRepository;