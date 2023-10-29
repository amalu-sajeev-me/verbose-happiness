import http from 'http';
import express, { RequestHandler } from 'express';
import { inject, injectable, singleton } from "tsyringe";
import { v2 as cloudinary } from 'cloudinary';
import { LoggerAdapter } from "@adapters/logger.adapter";
import { middlewares } from './middlewares';
import { RouterCollection } from './routers/RouterCollection';
import { PrimaryDBAdapter } from '@adapters/primaryDB.adapter';
import { singleFileUpload } from '@middlewares/multer';

@singleton()
@injectable()
export class Server {
    public httpServer!: http.Server;
    public app!: express.Application;
    private isInitialized = false;

    constructor(
        @inject(LoggerAdapter) private readonly _scream: LoggerAdapter,
        @inject(RouterCollection) private readonly _routerCollection: RouterCollection,
        @inject(PrimaryDBAdapter) private readonly _primaryDB: PrimaryDBAdapter
    ) { }

    private async initialize() {
        if (this.isInitialized) throw new Error('server is already initialized');
        await this.establishDBConections();
        this.configureExternalStorage();
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.isInitialized = true;
        this.addMiddlewares(middlewares);
        this.addRouters();
        this.handleErrors();
    }
    
    private addMiddlewares(middlewares: RequestHandler[]) {
        this.app.use(...middlewares);
    }
    private addRouters() {
        // this.app.use('/users', this._routerCollection._userRouter.main().instance);
        this.app.use('/upload', singleFileUpload, this._routerCollection._userRouter.main().instance)
    }
    public async startListening() {
        await this.initialize();
        const { PORT = 3000 } = process.env;
        const serverCallback = () => {
            this._scream.info(`server started listening to http://localhost:${PORT}`);
        }
        this.httpServer.listen(PORT, serverCallback);
    }
    private handleErrors() {
        const callback = (event: string) => (err: unknown) => {
            this._scream.error('an error occured. exiting the process', event);
            console.error(err);
            process.exit(0);
        };
        process
            .on('SIGINT', callback('SIGINT'))
            .on('uncaughtException', callback('uncaughtException'));
    }
    private async establishDBConections() {
        await this._primaryDB.connect()
    }
    private configureExternalStorage() {
        const {
            CLOUDINARY_ACCOUNT_ID,
            CLOUDINARY_API_KEY,
            CLOUDINARY_API_SECRET
        } = process.env;
        cloudinary.config({
            account_id: CLOUDINARY_ACCOUNT_ID,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET
        });
    }
}