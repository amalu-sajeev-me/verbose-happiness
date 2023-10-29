import { RequestHandler } from "express";
import { inject, injectable } from "tsyringe";

import { IUserEntity } from "@types-local/IUserEntity.type";
import { UserService } from "@services/User.service";

@injectable()
export class UserController{
    constructor(
        @inject(UserService) private _userService: UserService
    ){}
    public createUser: RequestHandler< unknown, string, IUserEntity> = async (req, res) => {
        const user = req.body;
        this._userService.createNewUser(user);

        res.send('user creation succesfully')
    };
}