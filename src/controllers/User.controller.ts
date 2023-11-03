import { RequestHandler } from "express";
import { inject, injectable } from "tsyringe";

import { IUserEntity } from "@types-local/IUserEntity.type";
import { UserService } from "@services/User.service";
import { ApiResponse, RESPONSE_STATUS_CODES } from "@utils/ApiResponse";
import { LoggerAdapter } from "@adapters/logger.adapter";
import { APIError } from "@utils/APIError";

@injectable()
export class UserController{
    constructor(
        @inject(UserService) private _userService: UserService,
        @inject(LoggerAdapter) private _scream: LoggerAdapter
    ){}
    public createUser: RequestHandler<unknown, ApiResponse, IUserEntity> = async (
        req, res, next
    ) => {
        const user = req.body;
        try {
            const result = await this._userService.createNewUser(user);
            return res.send(new ApiResponse(result, 'success', 'user creation succesfully'));
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'failed to create user';
            this._scream.error(errorMessage);
            next(error);
        }
    };

    public login: RequestHandler<unknown, Record<'token', string> | unknown, IUserEntity> = async (req, res, next) => {
        const { email, password } = req.body;
        try {
            const result = await this._userService.login({ email, password });
            return res.json(new ApiResponse(result, 'success', 'succesfully logged in'));
        } catch (error) {
            const errorResponse = new APIError(
                RESPONSE_STATUS_CODES.UNAUTHORIZED,
                "authentication failed",
                error instanceof Error? error.message: null
            )
            return next(errorResponse);
        }
    }
}