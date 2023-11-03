import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { inject, injectable } from "tsyringe";
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';

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
            const savedDoc = await this.savePdfDoc(response, fileName, owner);
            return savedDoc ? savedDoc.toObject(): savedDoc;
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
            return newDocument;
        } catch (err) {
            this._scream.error('failed to save pdfDocument', 'mongodb');
            this._scream.error(err instanceof Error ? err.message : '');
        }
    }

    public async getOneById(id: string) {
        const file = await this._pdfDocModel.findById(id);
        const publicUrl = file && this.getSignedUrl(file.storageData.public_id);
        console.log({publicUrl})
        return file;
    }

    public async getAllFiles(owner: string, pageNumber: number = 1) {
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        const count =  await this._pdfDocModel.count({owner})
        const totalPages = Math.ceil(count / limit);
        const data = await this
            ._pdfDocModel
            .aggregate([
                {
                    $match: {
                        owner
                    }
                },
                {
                    $addFields: {
                        format: '$storageData.format',
                        public_id: '$storageData.public_id',
                        bytes: '$storageData.bytes',
                        created_at: '$storageData.created_at',
                        folder: '$storageData.folder'
                    },
                },
                {
                    $unset: 'storageData'
                },
                {
                    $sort: {
                        created_at: 1
                    }
                }
            ])
            .skip(skip)
            .limit(limit);
        console.log({allfiles: data})
        return {data, totalPages};
    }

    public extractPages = async (pages: number[], docId: string) => {
        try {

            const publicId = (await this.getPublicIdByFileId(docId))!;
            const secureUrl = await this.getSignedUrl(publicId);
            const { data: pdfBytes } = await axios.get(secureUrl, { responseType: 'arraybuffer' });
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const extractedPdf = await PDFDocument.create();
            for (const pageNumber of pages) {
                const [pdfPage] = await extractedPdf.copyPages(pdfDoc, [pageNumber - 1]);
                extractedPdf.addPage(pdfPage);
            }
            return await extractedPdf.save();
        } catch (err) {
            console.log('error while xtracting');
            console.log(err);
        }
    }
    private async getSignedUrl(publicId: string) {
        const { secure_url } = await cloudinary.api.resource(publicId, {
            resource_type: 'image',
            image_metadata: true
        });
        // const url = await cloudinary.utils.private_download_url(publicId, 'png', {expires_at: Date.now() + 300, attachment: true});
        return secure_url as string;
    }
    private async getPublicIdByFileId(docId: string) {
        const doc = await this._pdfDocModel.findById(docId);
        return doc ? doc.storageData.public_id : null;
    }
}