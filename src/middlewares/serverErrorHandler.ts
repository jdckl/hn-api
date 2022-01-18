import { logger } from "./logger";

export default (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    switch (error.code) {
        case 'EACCES':
          logger.error(`${error.code} - Server requires elevated privileges.`);
          process.exit(1);
        break;
        case 'EADDRINUSE':
          logger.error(`${error.code} - Server address/port is already in use.`);
          process.exit(1);
        break;
        default:
          throw error;
    }
}