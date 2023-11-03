import { RequestHandler } from "express";
import { inject, injectable } from "tsyringe";
import mime from 'mime';

import { PdfDocService } from "@services/PdfDoc.service";
import { ObjectId } from "mongoose";
import { IGetAllFilesReqParams } from "./types/user.controller.types";
import { APIError } from "@utils/APIError";
import { ApiResponse, RESPONSE_STATUS_CODES } from "@utils/ApiResponse";
import path from "path";
import { DateUtils } from "@utils/Date.utils";

@injectable()
export class FileController{
    constructor(
        @inject(PdfDocService) private _pdfDocService: PdfDocService
    ){}
    public createFile: RequestHandler<unknown, ApiResponse, unknown> = async (req, res) => {
        const userData = req.user as Record<'_id', ObjectId>;
        try {
            if (!req.file) throw new Error('no file uploaded');
            const { originalname, mimetype } = req.file;
            const extractedFileName = path.basename(originalname, path.extname(originalname));
            const fileExtension = mime.getExtension(mimetype);
            const { dateString } = DateUtils;
            const newGeneratedFileName = `${extractedFileName}-${dateString}.${fileExtension}`;
            const responseData = await this
                ._pdfDocService
                .uploadOne(
                    req.file.buffer,
                    newGeneratedFileName,
                    userData._id);
            return res.send(
                new ApiResponse(
                    {...responseData},
                    'success'
                )
            )
        } catch (err) {
            throw new APIError(
                RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR,
                'failed to create a new Document in server',
                err instanceof Error? err.message: null
            )
        }
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
    public extractPages: RequestHandler<{ fileId: string }, ApiResponse<Record<string, unknown>>> = async (
        req, res
    ) => {
        try {
            const { pages } = req.body as { pages: number[] };
            const { fileId } = req.params;
            const { _id: owner } = req.user as {_id: ObjectId};
            const extractedPdf = (await this
                ._pdfDocService
                .extractPages(pages, fileId))!;
            const bufferBytes = Buffer.from(extractedPdf);
            const result = await this
                ._pdfDocService
                .uploadOne(bufferBytes, `extracted-${Date.now()}.pdf`, owner);
            res.send(
                new ApiResponse(
                    {result},
                    'success',
                    'succesfully extracted your file'
                )
            )
        } catch (error) {
            //
        }
    }
}