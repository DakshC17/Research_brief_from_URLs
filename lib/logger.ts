// Simple structured logger for Next.js compatibility
// Avoids Pino's worker thread issues in Next.js environment

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogData {
    [key: string]: any;
}

class Logger {
    private context?: string;

    constructor(context?: string) {
        this.context = context;
    }

    private log(level: LogLevel, data: LogData, message: string) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            level,
            time: timestamp,
            ...(this.context && { context: this.context }),
            ...data,
            msg: message,
        };

        // Output as JSON for structured logging
        console.log(JSON.stringify(logEntry));
    }

    info(data: LogData, message: string) {
        this.log('info', data, message);
    }

    error(data: LogData, message: string) {
        this.log('error', data, message);
    }

    warn(data: LogData, message: string) {
        this.log('warn', data, message);
    }

    debug(data: LogData, message: string) {
        if (process.env.NODE_ENV !== 'production') {
            this.log('debug', data, message);
        }
    }

    child(data: LogData): Logger {
        const childLogger = new Logger(this.context);
        // Merge parent context with child data
        Object.assign(childLogger, data);
        return childLogger;
    }
}

// Create base logger
export const logger = new Logger();

// Helper function to create child loggers with context
export function createLogger(context: string): Logger {
    return new Logger(context);
}

// Helper functions for common logging patterns
export const log = {
    info: (msg: string, data?: LogData) => logger.info(data || {}, msg),
    error: (msg: string, error?: Error | LogData) => {
        if (error instanceof Error) {
            logger.error({ err: error.message, stack: error.stack }, msg);
        } else {
            logger.error(error || {}, msg);
        }
    },
    warn: (msg: string, data?: LogData) => logger.warn(data || {}, msg),
    debug: (msg: string, data?: LogData) => logger.debug(data || {}, msg),
};

export default logger;
