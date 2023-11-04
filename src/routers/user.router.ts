import { Router } from "express";
import { container, injectable } from "tsyringe";

import { UserController } from "@controllers/User.controller";
import { BaseRouter } from "@routers/BaseRouter";
import { requestBodyValidate } from "@middlewares/requestBodyValidate";
import { userSchema } from "@schemas/user.schema";

@injectable()
export class UserRouter extends BaseRouter<UserController>{
    protected _controller = container.resolve<UserController>(UserController);
    protected _router = Router();
    public main() {
        this._router
            .post(
                '/login',
                requestBodyValidate(userSchema, ['email', 'password']),
                this._controller.login
            )
            .post(
                '/new',
                requestBodyValidate(userSchema),
                this._controller.createUser
            );
        return this;
    }
}
