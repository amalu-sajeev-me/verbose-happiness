import http from 'http';
import express, { RequestHandler } from 'express';
import { LoggerAdapter } from "@adapters/logger.adapter";
import { inject, injectable, singleton } from "tsyringe";
import { middlewares } from './middlewares';

@singleton()
@injectable()
export class Server {
    public httpServer!: http.Server;
    public app!: express.Application;
    private isInitialized = false;

    constructor(
        @inject(LoggerAdapter) private readonly _scream: LoggerAdapter
    ) { }

    private async initialize() {
        if (this.isInitialized) throw new Error('server is already initialized');
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.isInitialized = true;
        this.addMiddlewares(middlewares);
        this.handleErrors();
    }
    
    private addMiddlewares(middlewares: RequestHandler[]) {
        this.app.use(...middlewares);
    }
    public async startListening() {
        this.initialize();
        const { PORT = 3000 } = process.env;
        const serverCallback = () => {
            this._scream.info(`server started listening to http://localhost:${PORT}`);
        }
        this.httpServer.listen(PORT, serverCallback);
    }
    private handleErrors() {
        const callback = () => {
            this._scream.error('an error occured. exiting the process');
            process.exit(0);
        };
        process
            .on('SIGINT', callback)
            .on('uncaughtException', callback);
    }
}