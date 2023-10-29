import { inject, injectable } from "tsyringe";

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
}