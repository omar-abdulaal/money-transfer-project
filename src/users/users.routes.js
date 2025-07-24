import express from 'express';
import UsersController from './users.controller.js';
import { authValidation } from '../middlewares/auth-validation.js';
import wrapper from '../shared/wrapper.js';

const router = express.Router();
const usersController = new UsersController();

router.post('/register', usersController.register);
router.post('/login', usersController.login);

router.post('/logout', authValidation, wrapper(usersController.logout));
router.get('/profile', authValidation, wrapper(usersController.getProfile));
router.get('/balance', authValidation, wrapper(usersController.getBalance));

router.put('/deactivate/:id', authValidation, wrapper(usersController.deactivateUser));

export default router;