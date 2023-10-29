import { RequestHandler } from "express";
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

export class UserController{
    [index: string]: RequestHandler;
    public createUser: RequestHandler = async (req, res) => {
        if (!req.file) return res.send('no file uploaded');
        console.log('request-file', req.file?.filename);
        await UserController.uploadFile(req.file.buffer);
        res.send('file uploaded succesfully')
    };

    private static uploadFile = async (fileBuffer: Buffer) => {
        const base64Data = fileBuffer.toString('base64url');
        const uploadOptions: UploadApiOptions = {
            folder: 'hacktober-interview'
        };
        const response = await cloudinary.uploader.upload(base64Data, uploadOptions);
        console.log(response);
    }
}