import { inject, injectable } from "tsyringe";
import { UserRouter } from "./user.router";
import { FileRouter } from "./File.router";

@injectable()
export class RouterCollection{
    constructor(
        @inject(UserRouter) public _userRouter: UserRouter,
        @inject(FileRouter) public _fileRouter: FileRouter
    ){}
}