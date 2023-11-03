import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { inject, injectable } from "tsyringe";
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';

import { LoggerAdapter } from "@adapters/logger.adapter";
import { PdfDocModel } from "@models/PdfDoc.model";
import { ObjectId } from 'mongoose';
import { APIError } from '@utils/APIError';
import { RESPONSE_STATUS_CODES } from '@utils/ApiResponse';

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
            throw new APIError(
                RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR,
                `couldn't upload the file`,
                err instanceof Error ? err.message : null
            );
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
            const errorMessage = 'failed to save pdfDocument';
            this._scream.error(errorMessage, 'mongodb');
            throw new APIError(
                RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR,
                errorMessage,
                err instanceof Error? err.message: null
            )
        }
    }

    public async getOneById(id: string) {
        return await this._pdfDocModel.findById(id);
    }

    public async getAllFiles(owner: string, pageNumber: number = 1) {
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        const count =  await this._pdfDocModel.count({owner})
        const totalPages = Math.ceil(count / limit);
        try {
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
            return {data, totalPages};
        } catch (err) {
            throw new APIError(
                RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR,
                'failed to fetch files',
                err instanceof Error ? err.message: null
            )
        }
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
            const errorMessage = `failed to extract pages from the file`;
            this._scream.error(errorMessage);
            throw new APIError(
                RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR,
                errorMessage,
                err instanceof Error? err.message : null
            )
        }
    }
    private async getSignedUrl(publicId: string) {
        try {
            const { secure_url } = await cloudinary.api.resource(publicId, {
                resource_type: 'image',
                image_metadata: true
            });
            return secure_url as string;
        } catch (err) {
            const errorMessage = `failed to generate the signed url for the resource`;
            this._scream.error(errorMessage);
            throw new APIError(
                RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR,
                errorMessage,
                err instanceof Error? err.message : null
            )
        }
    }
    private async getPublicIdByFileId(docId: string) {
        try {
            const doc = (await this
                ._pdfDocModel
                .findOne({
                    _id: docId
                }, {
                    'storageData.public_id': 1
                }));
            if (!doc) throw new Error('requested document not found');
            return doc.storageData.public_id;
        } catch (err) {
            const errorMessage = `failed to fetch the publicId`;
            this._scream.error(errorMessage);
            throw new APIError(
                RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR,
                errorMessage,
                err instanceof Error ? err.message: null
            )
        }
    }
}