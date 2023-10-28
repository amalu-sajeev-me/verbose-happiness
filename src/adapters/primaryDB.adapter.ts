import { inject, injectable, singleton } from "tsyringe";
import mongoose from 'mongoose';
import { LoggerAdapter } from "./logger.adapter";

@singleton()
@injectable()
export class PrimaryDBAdapter {
    public connection!: mongoose.Connection;

    constructor(@inject(LoggerAdapter) private readonly _scream: LoggerAdapter) { }
    
    async connect() {
        this.handleEvents();
        try {
            const { PRIMARY_DB_CONN_URL, PRIMARY_DB_NAME } = process.env;
            const db = await mongoose.connect(PRIMARY_DB_CONN_URL, {
                dbName: PRIMARY_DB_NAME,
            });
            this.connection = db.connection;
            this.handleErrors();
        } catch (error) {
            this._scream.error('database connection failed', 'mongodb>mongoose');
            throw error;
        }
    }
    private handleEvents() {
        mongoose.connection.on('connected', () => {
            this._scream.info('Primary Database connection Succesfull', 'Mongodb');
        })
    }
    private handleErrors() {
        if (!this.connection) throw new Error('no monoose connection found');
        this.connection.on('disconnected', () => {
            this._scream.error('disconnected from database', 'mongodb>mongoose');
        })
    }
}