import { RequestHandler } from "express";
import { inject, injectable } from "tsyringe";
import mime from 'mime';

import { PdfDocService } from "@services/PdfDoc.service";
import { ObjectId } from "mongoose";
import { IGetAllFilesReqParams } from "./types/user.controller.types";
import { APIError } from "@utils/APIError";
import { ApiResponse, RESPONSE_STATUS_CODES } from "@utils/ApiResponse";

@injectable()
export class FileController{
    constructor(
        @inject(PdfDocService) private _pdfDocService: PdfDocService
    ){}
    public createFile: RequestHandler<unknown, string, unknown> = async (req, res) => {
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

    public getOneFile: RequestHandler<Record<'fileId', string>, ApiResponse<Record<string, unknown>>> = async (
        req, res, next
    ) => {
        const { fileId } = req.params;
        try {
            const data = await this._pdfDocService.getOneById(fileId) as unknown as Record<string, unknown>;
            const responseData = new ApiResponse(
                data,
                'success'
            );
            return res.send(responseData);
        } catch (error) {
            next(new APIError(
                RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR,
                'failed to fetch file info',
                error instanceof Error ? error.message : null
            ));
        }
    }

    public getAllFiles: RequestHandler<IGetAllFilesReqParams> =async (req, res, next) => {
        const { pageNumber } = req.params;
        const { _id: owner } = req.user as { _id: string };
        try {
            const {totalPages, data} = await this._pdfDocService.getAllFiles(owner, pageNumber);
            return res.send(new ApiResponse({
                data, totalPages
            },
            'success'
            ))
        } catch (error) {
            const errorResponse = new APIError(
                RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR,
                "failed to fetch all files",
                error instanceof Error ? error.message : null
            );
            next(errorResponse);
        }
    }
    public extractPages: RequestHandler = async (req, res) => {
        //
        const { pages } = req.body as { pages: number[] };
        const { fileId } = req.params as {fileId: string};
        const buff = await this._pdfDocService.extractPages(pages, fileId);
        console.log({ pages, buff });
        res.contentType('application/pdf');
        res.send(buff);
        // return res.send({ pages, body: req.body});
    }
}