import { Router } from "express";
import { container, injectable } from "tsyringe";

import { BaseRouter } from "@routers/BaseRouter";
import { FileController } from "@controllers/File.controller";
import { singleFileUpload } from "@middlewares/multer";

@injectable()
export class FileRouter extends BaseRouter<FileController>{
    protected _controller = container.resolve<FileController>(FileController);
    protected _router = Router();
    public main() {
        this._router.post('/', singleFileUpload, this._controller.createFile);
        this._router.get('/all/:pageNumber', this._controller.getAllFiles);
        this._router.get('/:fileId', this._controller.getOneFile);
        this._router.post('/:fileId/extract', this._controller.extractPages);
        return this;
    }
}
