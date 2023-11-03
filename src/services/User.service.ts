import { inject, injectable } from "tsyringe";
import jwt from 'jsonwebtoken';

import { LoggerAdapter } from "@adapters/logger.adapter";
import { UserModel } from "@models/User.model";
import { IUserEntity } from "@types-local/IUserEntity.type";
import { APIError } from "@utils/APIError";
import { RESPONSE_STATUS_CODES } from "@utils/ApiResponse";

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
            throw new APIError(
                RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR,
                "failed to create user",
                error instanceof Error ? error.message: null
            );
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
            throw new APIError(
                RESPONSE_STATUS_CODES.UNAUTHORIZED,
                "failed to login",
                err
            )
        }
    }
}