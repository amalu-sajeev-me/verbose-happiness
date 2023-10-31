import { inject, injectable } from "tsyringe";
import jwt from 'jsonwebtoken';

import { LoggerAdapter } from "@adapters/logger.adapter";
import { UserModel } from "@models/User.model";
import { IUserEntity } from "@types-local/IUserEntity.type";

@injectable()
export class UserService {
    private _userModel = UserModel;
    constructor(
        @inject(LoggerAdapter) private _scream: LoggerAdapter,
    ) { }
    public async createNewUser(user: IUserEntity) {
        const newUser = new this._userModel(user);
        try {
            await newUser.save();
            this._scream.info(`new user ${user.firstName} has been created`);
        } catch (error) {
            this._scream.error('failed to create user');
            throw error;
        }
    }

    public async login(user: Pick<IUserEntity, 'email' | 'password'>) {
        try {
            const invalidError = new Error('invalid credentials');
            const foundUser = await this._userModel.findOne({ email: user.email });
            if (!foundUser) throw invalidError;
            const isValid = await foundUser.isValidPassword(user.password);
            if (isValid) {
                const user = { ...foundUser } as Partial<IUserEntity>;
                delete user.password;
                const token = jwt.sign({ user }, 'secret');
                return { token };
            }
            throw invalidError;
        } catch (err) {
            this._scream.error('failed to login');
            throw err;
        }
    }
}