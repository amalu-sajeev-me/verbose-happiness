import { injectable } from "tsyringe";
import jwt from 'jsonwebtoken';

import { UserModel } from "@models/User.model";
import { IUserEntity } from "@types-local/IUserEntity.type";
import { APIError } from "@utils/APIError";
import { RESPONSE_STATUS_CODES } from "@utils/ApiResponse";
import { AbstractService } from "./Abstract.service";

@injectable()
export class UserService extends AbstractService<typeof UserModel>{
    protected _Model = UserModel;
    constructor() {
        super();
     }
    public async createNewUser(user: IUserEntity) {
        try {
            const existingUser = await this._Model.exists({ email: user.email });
            if (existingUser) throw new Error('username already exists');
            const newUser = new this._Model(user);
            await newUser.save();
            const savedUser = newUser.toObject() as Partial<IUserEntity>;
            delete savedUser.password;
            this._scream.info(`new user ${user.firstName} has been created`);
            return savedUser;
        } catch (error) {
            throw new APIError(
                RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR,
                (error as Error).message || 'failed to create user',
                "failed to create user",
            );
        }
    }

    public async login({email, password}: Pick<IUserEntity, 'email' | 'password'>) {
        try {
            const foundUser = await this._Model.findOne({ email });
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