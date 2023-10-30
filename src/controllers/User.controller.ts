import { RequestHandler } from "express";
import { inject, injectable } from "tsyringe";
import jwt from 'jsonwebtoken';

import { IUserEntity } from "@types-local/IUserEntity.type";
import { UserService } from "@services/User.service";
import { PassportConfig } from "../auth/passport.config";

@injectable()
export class UserController{
    constructor(
        @inject(UserService) private _userService: UserService,
        @inject(PassportConfig) private _passportConfig: PassportConfig
    ){}
    public createUser: RequestHandler< unknown, string, IUserEntity> = async (req, res) => {
        const user = req.body;
        this._userService.createNewUser(user);

        res.send('user creation succesfully')
    };

    public login: RequestHandler = async (req, res, next) => {
        console.log('lolo')
        return this._passportConfig.instance.authenticate('login', async (err: unknown, user: Express.User) => {
            try {
                if (err || !user) {
                    const error = new Error('An error occurred.');
                    return next(error);
                }
                req.logIn(user, { session: false }, (error) => {
                    if (error) return next(error);
                    const token = jwt.sign({ user }, 'secret');
                    return res.json({ token });
                })
            } catch (error) {
                return next(error);
            }
        })(req, res, next);
    }
}