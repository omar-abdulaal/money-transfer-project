import UsersRepository from "../users/users.repository.js";
import mongoose from "mongoose";
import boxen from 'boxen';

async function usersSeed() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/money_transfer_db');
        console.log('Connected to database');

        const usersRepo = new UsersRepository();

        // Sample users data
        const sampleUsers = [
            
            {
                fullName: 'عمر عبد العال',
                email: 'omar.abdulaal@example.com',
                password: '123456',
                balance: 1000000
            },
            {
                fullName: 'أحمد علي',
                email: 'ahmed.ali@example.com',
                password: '123456',
                balance: 1000000
            },
            {
                fullName: 'محمد إبراهيم',
                email: 'mohammad.ibrahim@example.com',
                password: '123456',
                balance: 1000000
            }
        ];

        let createdCount = 0;
        let existingCount = 0;

        for (const userData of sampleUsers) {
            const existingUser = await usersRepo.findByEmail(userData.email);
            
            if (existingUser) {
                console.log(`User ${userData.email} already exists`);
                existingCount++;
                continue;
            }

            await usersRepo.create(userData);
            console.log(`Created user: ${userData.fullName} (${userData.email})`);
            createdCount++;
        }

        const message = `Users seeding completed!\nCreated: ${createdCount} new users\nExisting: ${existingCount} users\nEach user has 1,000,000 SYP balance\n\nSample login credentials:\nemail: ahmed.ali@example.com\npassword: 123456`;
        const framed = boxen(message, {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'blue'
        });

        console.log(framed);

    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database connection closed');
    }
}

usersSeed();