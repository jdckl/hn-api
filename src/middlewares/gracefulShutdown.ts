/**
 * Kill the process gracefully, shut down the server, and log
 * @param {object} server 
 * @param {object} options
 */

import { Server } from "http";
import { logger } from "./logger";

export default (SERVER: Server, options = { coredump: false, timeout: 500 }) => {
    // Exit function
    const exit = (err:NodeJS.ErrnoException|undefined) => {
      options.coredump ? process.abort() : process.exit(Number(err?.code))
    }
  
    // Attempt exit
    return (code:number, reason:string) => (err:NodeJS.ErrnoException|null) => {
        logger.error(`${code} - ${reason} - SHUTDOWN`);
        if (err && err instanceof Error) console.log(err.message, err.stack)

        // Attempt a graceful shutdown
        SERVER.close(exit)
        setTimeout(exit, options.timeout)
    }
}