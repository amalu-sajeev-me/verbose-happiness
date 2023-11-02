import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { inject, injectable } from "tsyringe";

import { LoggerAdapter } from "@adapters/logger.adapter";
import { PdfDocModel } from "@models/PdfDoc.model";
import { ObjectId } from 'mongoose';

@injectable()
export class PdfDocService {
    private _pdfDocModel = PdfDocModel;
    constructor(
        @inject(LoggerAdapter) private _scream: LoggerAdapter,
    ) { }
    
    public async uploadOne(fileBuffer: Buffer, fileName: string, owner: ObjectId) {

        const base64Data = fileBuffer.toString('base64');
        const base64DataUrl = `data:image/png;base64,${base64Data}`;
        const uploadOptions: UploadApiOptions = {
            folder: 'hacktober-interview',
            public_id: fileName,
        };
        try {
            const response = await cloudinary
                .uploader
                .upload(base64DataUrl, uploadOptions);
            this.savePdfDoc(response, fileName, owner);
        } catch (err) {
            console.log(err)
        }
    }

    public async savePdfDoc(
        metaData: UploadApiResponse,
        fileName: string,
        owner: ObjectId
    ) {
        try {
            const newDocument = new this._pdfDocModel({
                fileName,
                storageData: metaData,
                owner
            });
            await newDocument.save();
            this._scream.info('document added succesfully', 'mongodb');
        } catch (err) {
            this._scream.error('failed to save pdfDocument', 'mongodb');
            this._scream.error(err instanceof Error ? err.message : '');
        }
    }

    public async getOneById(id: string) {
        const file = await this._pdfDocModel.findById(id);
        return file;
    }

    public async getAllFiles(pageNumber: number = 1) {
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        const data = await this._pdfDocModel.find().skip(skip).limit(limit);
        console.log({allfiles: data})
        return data;
    }
}