import { RequestHandler } from "express";
import mime from 'mime';
import { PdfDocService } from "../services/PdfDoc.service";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserController{
    constructor(
        @inject(PdfDocService) private _pdfDocService: PdfDocService
    ){}
    public createUser: RequestHandler = async (req, res) => {
        if (!req.file) return res.send('no file uploaded');
        try {
            const { filename, mimetype } = req.file;
            const fileExtension = mime.getExtension(mimetype)
            await this._pdfDocService.uploadOne(req.file.buffer,`${filename}_${Date.now()}_.${fileExtension}`);
        } catch (err) {
            console.log(err);
        }
        res.send('file uploaded succesfully')
    };
}