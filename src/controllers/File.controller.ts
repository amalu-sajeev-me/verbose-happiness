import { RequestHandler } from "express";
import { inject, injectable } from "tsyringe";
import mime from 'mime';

import { PdfDocService } from "@services/PdfDoc.service";
import { ObjectId } from "mongoose";
import { IGetAllFilesReqParams } from "./types/user.controller.types";

@injectable()
export class FileController{
    constructor(
        @inject(PdfDocService) private _pdfDocService: PdfDocService
    ){}
    public createFile: RequestHandler<unknown, string, unknown> = async (req, res) => {
        console.log('lolo--', req.user);
        const userData = req.user as Record<'_id', ObjectId>;
        if (!req.file) return res.send('no file uploaded');
        try {
            const { filename, mimetype } = req.file;
            const fileExtension = mime.getExtension(mimetype)
            await this
                ._pdfDocService
                .uploadOne(
                    req.file.buffer,
                    `${filename}_${Date.now()}_.${fileExtension}`,
                userData._id)
        } catch (err) {
            console.log(err);
        }
        res.send('file uploaded succesfully')
    };

    public getOneFile: RequestHandler<Record<'fileId', string>, string, Record<string, unknown>> = async (req, res) => {
        const { fileId } = req.params;
        const data = await this._pdfDocService.getOneById(fileId);
        console.log(fileId, {data});
        return res.send('hello');
    }

    public getAllFiles: RequestHandler<IGetAllFilesReqParams> =async (req, res) => {
        const { pageNumber } = req.params;
        const data = await this._pdfDocService.getAllFiles(pageNumber);
        console.log({pageNumber, data})
        res.send(data);
    }
}