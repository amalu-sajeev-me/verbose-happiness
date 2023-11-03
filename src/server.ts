import http from 'http';
import express, { ErrorRequestHandler, RequestHandler } from 'express';
import { inject, injectable, singleton } from "tsyringe";
import { v2 as cloudinary } from 'cloudinary';

import { LoggerAdapter } from "@adapters/logger.adapter";
import { middlewares } from '@middlewares/';
import { RouterCollection } from '@routers/RouterCollection';
import { PrimaryDBAdapter } from '@adapters/primaryDB.adapter';
import passport from 'passport';
import { PassportConfig } from './auth/passport.config';
import { ApiResponse, RESPONSE_STATUS_CODES } from '@utils/ApiResponse';
import { APIError } from '@utils/APIError';

@singleton()
@injectable()
export class Server {
    public httpServer!: http.Server;
    public app!: express.Application;
    private isInitialized = false;

    constructor(
        @inject(PassportConfig) private _passportConfig: PassportConfig,
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
        this.applyCatchAllRouteHandler();
        this.handleErrors();
        // api erroe handler
        this.app.use(this.apiErrorHandler);
    }
    
    private addMiddlewares(middlewares: RequestHandler[]) {
        this.app.use(passport.initialize());
        this.app.use(...middlewares);
        this.app.use(passport.initialize({ compat: true }));
    }
    private addRouters() {
        const authenticate = this
            ._passportConfig
            .registerStrategies()
            .instance
            .authenticate('jwt', { session: false });
        this.app.use('/files', authenticate ,this._routerCollection._fileRouter.main().instance);
        this.app.use('/user', this._routerCollection._userRouter.main().instance);
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
            this.terminateAll();
        };
        process
            .on('SIGINT', callback('SIGINT'))
            .on('uncaughtException', callback('uncaughtException'))
            .on('unhandledRejection', callback('unhandledRejection'));
        this
            .httpServer
            .on('close', () => this._scream.error('sever closed'))
            .on('error', (err) => {
                const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
                this._scream.error(errorMessage);
            });
    }
    public async terminateAll(options: { coreDump?: boolean } = {}) {
        const { coreDump = true } = options
        await this._primaryDB.connection.close();
        this.httpServer.close();
        setTimeout(() => {
            if (coreDump) process.abort();
            else process.exit(1);
        }, 500).unref();
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
    private apiErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
        const response = new ApiResponse({ error: err }, 'failure', 'api error');
        if ('status' in err) return res.status(err.status).send(response);
        if ('statusCode' in err) {
            response.withStatus(err.statusCode);
            return res.status(err.statusCode).send(response);
        }
        res.status(500).send(response);
        this._scream.debug(_next.name);
    }
    private applyCatchAllRouteHandler() {
        const allRequestHandler: RequestHandler = (req, res, next) => {
            const error404 = new APIError(
                RESPONSE_STATUS_CODES.NOT_fOUND,
                "RESOURCE NOT FOUND",
                "unknown request"
            );
            next(error404);
        }
        this.app.all('*', allRequestHandler);
    }
}