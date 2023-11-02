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
        try {
            const existingUser = await this._userModel.exists({ email: user.email });
            if (existingUser) throw new Error('username already exists');
            const newUser = new this._userModel(user);
            await newUser.save();
            const savedUser = newUser.toObject() as Partial<IUserEntity>;
            delete savedUser.password;
            this._scream.info(`new user ${user.firstName} has been created`);
            return savedUser;
        } catch (error) {
            this._scream.error('failed to create user');
            throw error;
        }
    }

    public async login({email, password}: Pick<IUserEntity, 'email' | 'password'>) {
        try {
            const foundUser = await this._userModel.findOne({ email });
            if (!foundUser) throw Error('invalid credentials');
            const isValid = await foundUser.isValidPassword(password);
            if (!isValid) throw new Error('invalid credentials');
            const user = { ...foundUser } as Partial<IUserEntity>;
            delete user.password;
            const token = jwt.sign({ ...user }, 'secret');
            return { token };
        } catch (err) {
            this._scream.error('failed to login');
            throw new Error('failed to login', {cause: err});
        }
    }
}