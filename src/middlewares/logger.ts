import {Options} from 'morgan';
import winston from "winston";
import path from 'path';
import { IncomingMessage, ServerResponse } from 'http';

export const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: `${path.resolve(__dirname, '../logs/app.log')}`,
            handleExceptions: true,
            maxsize: 5242880, //5MB
            maxFiles: 5
        }),
        new winston.transports.Console({
            level: 'info',
            handleExceptions: true
        })
    ],
    exitOnError: false
})

export const morganOption: Options<IncomingMessage, ServerResponse> = {
    stream: {
        write: (message: string) => {
            logger.info(message.trim())
        }
    }
}