import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { injectable } from "tsyringe";
import { ObjectId } from 'mongoose';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';

import { PdfDocModel } from "@models/PdfDoc.model";
import { APIError } from '@utils/APIError';
import { RESPONSE_STATUS_CODES } from '@utils/ApiResponse';
import { AbstractService } from './Abstract.service';

@injectable()
export class PdfDocService extends AbstractService<typeof PdfDocModel>{
    protected _Model = PdfDocModel;
    constructor() {
        super();
    }
    
    public async uploadOne(fileBuffer: Buffer, fileName: string, owner: ObjectId) {

        const bytes = fileBuffer.byteLength;
        const pageCount = (await PDFDocument.load(fileBuffer)).getPageCount();
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
            const savedDoc = await this
                .savePdfDoc(
                    response, fileName, owner, pageCount, bytes
                );
            return savedDoc ? savedDoc: savedDoc;
        } catch (err) {
            throw new APIError(
                RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR,
                `couldn't upload the file`,
                err
            );
        }
    }

    public async savePdfDoc(
        metaData: UploadApiResponse,
        fileName: string,
        owner: ObjectId,
        pageCount: number,
        bytes: number
    ) {
        try {
            const newDocument = new this._Model({
                fileName,
                storageData: metaData,
                owner, 
                pageCount,
                bytes
            });
            await newDocument.save();
            this._scream.info('document added succesfully', 'mongodb');
            return newDocument.toObject();
        } catch (err) {
            const errorMessage = 'failed to save pdfDocument';
            this._scream.error(errorMessage, 'mongodb');
            throw new APIError(
                RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR,
                errorMessage,
                err
            )
        }
    }

    public async getOneById(id: string) {
        const doc = await this
            ._Model
            .findById(id, {
                fileName: 1,
                owner: 1,
                bytes: 1,
                pageCount: 1,
                'storageData.created_at': 1,
                'storageData.secure_url': 1
            });
        return doc ? doc.toObject(): null;
    }

    public async getAllFiles(owner: string, pageNumber: number = 1) {
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        const count =  await this._Model.count({owner})
        const totalPages = Math.ceil(count / limit);
        console.log('lol', owner)
        try {
            const data = await this
                ._Model
                .aggregate([
                    {
                        $match: {
                            owner: String(owner)
                        }
                    },
                    {
                        $addFields: {
                            format: '$storageData.format',
                            secure_url: '$storageData.secure_url',
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
                err
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
                err
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
                err
            )
        }
    }
    private async getPublicIdByFileId(docId: string) {
        try {
            const doc = (await this
                ._Model
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
                err
            )
        }
    }
}