import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import path from 'path';

const baseController = {

    /**
     * Generate a salt
     * @returns {string}
     */
    generateSalt: async () : Promise<string> => await bcrypt.genSalt(),

    /**
     * Hash a given password
     * @param {string} password 
     * @returns {string}
     */
     hashPassword: async (password: string, salt: string) : Promise<string> => await bcrypt.hash(password, salt),

     /**
      * Compare given password to server-salt
      * @param {string} password 
      * @returns {boolean}
      */
     comparePassword: async (password: string, hash: string) : Promise<boolean> => await bcrypt.compare(password, hash),
 
     /**
      * Render simple HTML file for direct access
      * @param {Request} req 
      * @param {Response} res 
      * @returns {Response}
      */
     renderSplash: (_req: Request, res: Response) => res.sendFile(path.resolve('index.html'))
}

export default baseController