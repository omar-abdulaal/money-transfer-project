import UsersRepository from "../users/users.repository.js";
import mongoose from "mongoose";
import boxen from 'boxen';

async function adminSeed() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/money_transfer_db');
        console.log('Connected to database');

        const usersRepo = new UsersRepository();
        const rawPwd = '12345678';

        // Check if admin already exists
        const existingAdmin = await usersRepo.findByEmail('admin@system.com');
        if (existingAdmin) {
            console.log('Admin user already exists');
            await mongoose.disconnect();
            return;
        }

        // Create admin user
        await usersRepo.create({
            fullName: 'System Administrator',
            email: 'admin@system.com',
            password: rawPwd,
            role: 'admin',
            balance: 1000000
        });

        const message = `Admin user created successfully!\nemail: admin@system.com\npassword: ${rawPwd}\nbalance: 1,000,000 SYP`;
        const framed = boxen(message, {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'green'
        });

        console.log(framed);

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database connection closed');
    }
}

adminSeed();