import { Router } from "express";
import { container, injectable } from "tsyringe";

import { UserController } from "@controllers/User.controller";
import { BaseRouter } from "@routers/BaseRouter";
import { PassportConfig } from "../auth/passport.config";

@injectable()
export class UserRouter extends BaseRouter<UserController>{
    private _passportConfig =  container.resolve(PassportConfig);
    protected _controller = container.resolve<UserController>(UserController);
    protected _router = Router();
    public main() {
        this._router.post('/login', this._controller.login);
        this._router.post('/new', this._controller.createUser);
        return this;
    }
}
