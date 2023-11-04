import { RequestHandler } from "express";
import { inject, injectable } from "tsyringe";

import { IUserEntity } from "@types-local/IUserEntity.type";
import { UserService } from "@services/User.service";
import { ApiResponse, RESPONSE_STATUS_CODES } from "@utils/ApiResponse";
import { APIError } from "@utils/APIError";

@injectable()
export class UserController{
    constructor(
        @inject(UserService) private _userService: UserService,
    ){}
    public createUser: RequestHandler<
        unknown, ApiResponse, IUserEntity
    > = async (
        req, res, next
    ) => {
        try {
            const user = req.body;
            const result = await this
                ._userService
                .createNewUser(user);
            return res.send(new ApiResponse(result, 'success', 'user creation succesfully'));
        } catch (error) {
            next(new APIError(
                RESPONSE_STATUS_CODES.BAD_REQUEST,
                'failed to create user',
                error
            ));
        }
    };

    public login: RequestHandler<
        unknown, Record<'token', string> | unknown, IUserEntity
        > = async (
            req, res, next
        ) => {
        try {
            const { email, password } = req.body;
            const result = await this._userService.login({ email, password });
            return res.json(new ApiResponse(result, 'success', 'succesfully logged in'));
        } catch (error) {
            next(new APIError(
                RESPONSE_STATUS_CODES.UNAUTHORIZED,
                "authentication failed",
                error
            ));
        }
    }
}