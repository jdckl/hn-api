import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import defaultConfig from '../config/default.config';

// Base jwt interface
interface AuthToken {
    userId: number;
    email: string;
}

/**
 * Sign a token for a user
 * @param {object} user 
 * @returns {string} 
 */
export const signToken = (user:{id:number, email:string, password?:string}) : object => {
    // Expire in 1 hour
    const expiration = Math.floor(Date.now() / 1000) + (60 * 60);

    // Sign a token
    const token = sign({userId: user.id, email: user.email}, defaultConfig.appSecret, {
        expiresIn: expiration
    });

    return {
        token: token,
        expires: expiration,
        userId: user.id
    };
}

/**
 * Express middleware to verify a given authorization header
 * @param {AuthorizedRequest} req 
 * @param {Response} res 
 * @param {NextFunction} next
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers['authorization']?.replace('Bearer ', '');
    if (!token) return res.status(401).json({error: true, message: 'Missing token!'});
    let jwtPayload;

    try {
        jwtPayload = verify(token, defaultConfig.appSecret);
    } catch (error: unknown) {
        return res.status(401).json({ error: true, message: (error instanceof Error && process.env.NODE_ENV!=='production') ? error.message : 'Unathorized access!' });
    }

    req.currentUser = <AuthToken>jwtPayload;
    return next();
}