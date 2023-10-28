import { LoggerAdapter } from '../logger.adapter';

// Mocking pino and tsyringe
jest.mock('pino', () => {
  return {
    pino: jest.fn(() => ({
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    })),
    type: {},
    LoggerOptions: {},
  };
});

jest.mock('tsyringe', () => {
  return {
    injectable: jest.fn(),
    singleton: jest.fn(),
  };
});

describe('LoggerAdapter', () => {
    let loggerAdapter: LoggerAdapter;

    beforeEach(() => {
        loggerAdapter = new LoggerAdapter();
    });

    it('should create a logger instance', () => {
        expect(loggerAdapter).toBeDefined();
    });

    it('should call debug method with formatted message', () => {
        loggerAdapter.debug('Test Message', 'Context');
        expect(loggerAdapter['logger'].debug).toHaveBeenCalledWith('Test Message ::: [Context]');
    });

    it('should call info method with formatted message', () => {
        loggerAdapter.info('Test Message', 'Context');
        expect(loggerAdapter['logger'].info).toHaveBeenCalledWith('Test Message ::: [Context]');
    });

    it('should call warn method with formatted message', () => {
        loggerAdapter.warn('Test Message', 'Context');
        expect(loggerAdapter['logger'].warn).toHaveBeenCalledWith('Test Message ::: [Context]');
    });

    it('should call error method with formatted message', () => {
        loggerAdapter.error('Test Message', 'Context');
        expect(loggerAdapter['logger'].error).toHaveBeenCalledWith('Test Message ::: [Context]');
    });

});
