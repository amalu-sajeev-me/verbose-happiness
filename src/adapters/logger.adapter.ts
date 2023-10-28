import { type Logger, type LoggerOptions, pino } from 'pino';
import { injectable, singleton } from 'tsyringe';
import type { ILogger } from './logger.types.js';

@singleton()
@injectable()
export class LoggerAdapter implements ILogger {
    private logger: Logger;

    constructor() {
        const options: LoggerOptions = {
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true
                }
            }
        };
        this.logger = pino(options);
    }

    private formatMessage(message: string, context?: string): string{
        const contextString = context ? `[${context}]` : ''; // Remove extra space
        return `${message} ::: ${contextString}`;
    }


    debug(message: string, context?: string): void {
        this.logger.debug(this.formatMessage(message, context));
    }
    info(message: string, context?: string): void {
        this.logger.info(this.formatMessage(message, context));
    }
    warn(message: string, context?: string): void {
        this.logger.warn(this.formatMessage(message, context));
    }
    error(message: string, context?: string): void {
        this.logger.error(this.formatMessage(message, context));
    }
}