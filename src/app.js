import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import { authValidation } from './middlewares/auth-validation.js';
import errorHandler from './middlewares/error-handler.js';
import usersRoutes from './users/users.routes.js';
import transactionsRoutes from './transactions/transactions.routes.js';

const app = express();
const PORT = 3006;

mongoose.connect('mongodb://127.0.0.1:27017/money_transfer_db')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Database connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'money-transfer-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 60 * 60 * 1000 // 1 hour
    }
}));

app.use('/users', usersRoutes);
app.use('/transactions', authValidation, transactionsRoutes);
app.get('/', (req, res) => { // to show api endpoints in the root
    res.json({
        message: 'Money Transfer System API',
        endpoints: {
            auth: {
                register: 'POST /users/register',
                login: 'POST /users/login',
                logout: 'POST /users/logout'
            },
            transactions: {
                transfer: 'POST /transactions/transfer',
                history: 'GET /transactions/history',
                all: 'GET /transactions/all (admin only)'
            },
            user: {
                profile: 'GET /users/profile',
                balance: 'GET /users/balance',
                deactivate: 'PUT /users/deactivate/:id (admin only)'
            }
        }
    });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});