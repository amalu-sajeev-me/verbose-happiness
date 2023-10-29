import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { inject, injectable } from "tsyringe";

import { LoggerAdapter } from "@adapters/logger.adapter";
import { PdfDocModel } from "@models/PdfDoc.model";

@injectable()
export class PdfDocService {
    private _pdfDocModel = PdfDocModel;
    constructor(
        @inject(LoggerAdapter) private _scream: LoggerAdapter,
    ) { }
    
    public async uploadOne(fileBuffer: Buffer, fileName: string) {

        const base64Data = fileBuffer.toString('base64');
        const base64DataUrl = `data:image/png;base64,${base64Data}`;
        const uploadOptions: UploadApiOptions = {
            folder: 'hacktober-interview',
            public_id: fileName,
        };
        try {
            const response = await cloudinary.uploader.upload(base64DataUrl, uploadOptions);
            this.savePdfDoc(response, fileName);
        } catch (err) {
            console.log(err)
        }
    }

    public async savePdfDoc(metaData: UploadApiResponse, fileName: string) {
        try {
            const newDocument = new this._pdfDocModel({
                fileName, storageData: metaData
            });
            await newDocument.save();
            this._scream.info('document added succesfully', 'mongodb');
        } catch (err) {
            this._scream.error('failed to save pdfDocument', 'mongodb');
            this._scream.error(err instanceof Error ? err.message : '');
        }
    }
}