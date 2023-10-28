import { Request, Response } from 'express';
import morgan from 'morgan';

const morganOptions: morgan.Options<Request, Response> = {
    immediate: true
};
export const morganMiddleware = morgan('dev', morganOptions);