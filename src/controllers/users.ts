import {NextFunction, Request, Response} from 'express';
import { validationResult, body } from 'express-validator';
import { signToken } from '../middlewares/auth';

import User from '../models/Users';
import baseController from './base';

const userController = {
    /**
     * @ignore
     * Validate incoming input
     * @param {string} method method name
     * @returns {NextFunction|Response}
     */
    validate: (method: string) => {
        switch (method) {
            case 'login':
            case 'createUser':
                return [
                    body('email').exists().notEmpty().isString(),
                    body('email', 'Invalid e-mail').exists().isEmail(),
                    body('password').exists().notEmpty().isString(),
                    (req:Request, res: Response, next: NextFunction) => {
                        const validationErrors = validationResult(req);
                        if (!validationErrors.isEmpty()) {
                            return res.status(400).json({ error: true, message: 'Invalid input data!' })
                        }

                        next();
                        return;
                    }
                ]
            default:
                return (_req:Request, _res: Response, next: NextFunction) => next()
        }
    },

    /**
     * POST /users/register
     * __Login with a email/password combination__
     * @param {string} email
     * @param {string} password
     */
    login: async (req:Request, res:Response) => {
        // Req data
        const {email, password} = req.body;

        // User document
        try {
            const userDoc = await User.findOne({ where: { email: email } });
            if (!userDoc) return res.status(404).json({ error: true, message: 'User account was not found!' });
    
            // Password match
            const passwordMatches = await baseController.comparePassword(password, userDoc.password);
            if (!passwordMatches) return res.status(404).json({ error: true, message: 'User account was not found!' });

            // Token handover
            const tokenData = signToken(userDoc);
            return res.status(200).json({ success: true, ...tokenData });
        } catch (error:unknown) {
            return res.status((error instanceof Error) ? 500 : 400).json({ error: true, message: (error instanceof Error && process.env.NODE_ENV!=='production') ? error.message : `Internal server error!` });
        }
    },

    /**
     * POST /users/register
     * __Register a new user account__
     * @param {string} email
     * @param {string} password
     */
    createUser: async (req:Request, res:Response) => {
        // Req data
        const {email, password} = req.body;

        // Hash password
        const bcryptSalt = await baseController.generateSalt();
        const hashedPassword = await baseController.hashPassword(password, bcryptSalt);

        // Existing user
        const emailRegistered = await User.findOne({
            where: {
                email: email
            }
        })
        if (emailRegistered) return res.status(400).json({ error: true, message: 'This user account already exists!' });

        // User document
        const userDoc = User.build({
            email: email,
            password: hashedPassword
        });

        try {
            await userDoc.save();
            const tokenData = signToken(userDoc);
            return res.status(200).json({ success: true, message: 'User account created!', ...tokenData });
        } catch (error:unknown) {
            return res.status((error instanceof Error) ? 500 : 400).json({ error: true, message: (error instanceof Error && process.env.NODE_ENV!=='production') ? error.message : `Internal server error!` });
        }
    }
}

export default userController