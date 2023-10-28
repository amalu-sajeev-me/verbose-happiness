import 'reflect-metadata';
import { container } from 'tsyringe';
import { LoggerAdapter } from '../src/adapters/logger.adapter';

container.registerSingleton('LoggerAdapter', LoggerAdapter);