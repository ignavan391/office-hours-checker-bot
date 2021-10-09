import winston, { transports } from 'winston';


const logger = winston.createLogger({
  levels: {
    trace: 0,
    input: 1,
    verbose: 2,
    prompt: 3,
    debug: 4,
    info: 5,
    data: 6,
    help: 7,
    warn: 8,
    error: 9
  },
  format: winston.format.json(),
  transports: [new transports.Console()]
});
export default logger;
