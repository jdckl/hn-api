import express from 'express';
import userController from '../controllers/users';

const userRouter = express.Router();

userRouter.post('/register', userController.validate('createUser'), userController.createUser);
userRouter.post('/login', userController.validate('login'), userController.login);

export default userRouter;