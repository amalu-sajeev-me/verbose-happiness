import { inject, injectable } from "tsyringe";
import { UserRouter } from "./user.router";

@injectable()
export class RouterCollection{
    constructor(
        @inject(UserRouter) public _userRouter: UserRouter
    ){}
}