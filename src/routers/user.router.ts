import { Router } from "express";
import { container, injectable } from "tsyringe";

import { UserController } from "@controllers/User.controller";
import { BaseRouter } from "@routers/BaseRouter";

@injectable()
export class UserRouter extends BaseRouter<UserController>{
    protected _controller = container.resolve<UserController>(UserController);
    protected _router = Router();
    public main() {
        this.add('post', '/', this._controller.createUser);
        return this;
    }
}
