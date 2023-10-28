import { UserController } from "../controllers/User.controller";
import { Router } from "express";
import { container, injectable } from "tsyringe";
import { BaseRouter } from "./BaseRouter";

@injectable()
export class UserRouter extends BaseRouter<UserController>{
    protected _controller = container.resolve<UserController>(UserController);
    protected _router = Router();
    public main() {
        this.add('get', '/', this._controller.createUser);
        return this;
    }
}
