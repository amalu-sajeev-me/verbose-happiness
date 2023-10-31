import { RequestHandler } from "express";
import { inject, injectable } from "tsyringe";

import { IUserEntity } from "@types-local/IUserEntity.type";
import { UserService } from "@services/User.service";

@injectable()
export class UserController{
    constructor(
        @inject(UserService) private _userService: UserService,
    ){}
    public createUser: RequestHandler<unknown, string, IUserEntity> = async (req, res) => {
        const user = req.body;
        this._userService.createNewUser(user);

        res.send('user creation succesfully')
    };

    public login: RequestHandler<unknown, Record<'token', string> | unknown, IUserEntity> = async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await this._userService.login({ email, password });
            res.json(result);
        } catch (err) {
            res.status(401).json(err);
        }
    }
}