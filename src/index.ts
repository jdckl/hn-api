import APP from "./app";
import defaultConfig from "./config/default.config";
import http from 'http';
import errorHandler from './middlewares/serverErrorHandler'
import gracefulShutdown from './middlewares/gracefulShutdown';

// Set port
APP.set('port', defaultConfig.applicationPort);

// Start http server
const SERVER = http.createServer(APP);
      SERVER.on('error', errorHandler);
      SERVER.on('listening', () => {
        const address = SERVER.address();
        const bind = typeof address === 'string' ? `pipe ${address}` : `port ${defaultConfig.applicationPort}`;
        console.log(`Listening on ${bind}`)
      });
      SERVER.listen(defaultConfig.applicationPort);

// Operational errors + OS signals
const shutdownHandler = gracefulShutdown(SERVER);
process.on('uncaughtException', shutdownHandler(1, 'Unexpected Error'));
process.on('unhandledRejection', shutdownHandler(1, 'Unhandled Promise'));
process.on('SIGTERM', shutdownHandler(0, 'SIGTERM'));
process.on('SIGINT', shutdownHandler(0, 'SIGINT'));