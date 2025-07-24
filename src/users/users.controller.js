import UsersRepository from './users.repository.js';

class UsersController {
    constructor() {
        this.usersRepo = new UsersRepository();
    }

    register = async (req, res) => {
        const { fullName, email, password } = req.body;

        // Validate input
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email, and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await this.usersRepo.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = await this.usersRepo.create({
            fullName,
            email,
            password
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: user
        });

    };

    login = async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await this.usersRepo.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account has been deactivated'
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create session
        req.session.userId = user._id;
        req.session.userRole = user.role;

        res.json({
            success: true,
            message: 'Login successful',
            user: user
        });

    };

    logout = async (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Could not log out'
                });
            }
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        });
    };

    getProfile = async (req, res) => {
        const user = await this.usersRepo.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: user
        });

    };

    getBalance = async (req, res) => {
        const user = await this.usersRepo.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            balance: user.balance
        });
    };

    deactivateUser = async (req, res) => {
        // Check if user is admin
        if (req.session.userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        const { id } = req.params;
        const user = await this.usersRepo.deactivateUser(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deactivated successfully',
            user: user
        });
    };
}

export default UsersController;