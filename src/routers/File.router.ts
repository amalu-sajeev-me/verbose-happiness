import { Router } from "express";
import { container, injectable } from "tsyringe";
import { BaseRouter } from "./BaseRouter";
import { FileController } from "../controllers/File.controller";
import { singleFileUpload } from "@middlewares/multer";

@injectable()
export class FileRouter extends BaseRouter<FileController>{
    protected _controller = container.resolve<FileController>(FileController);
    protected _router = Router();
    public main() {
        this.add('post', '/', singleFileUpload,this._controller.createFile);
        return this;
    }
}
