import { APIError } from '@utils/APIError';
import { RESPONSE_STATUS_CODES } from '@utils/ApiResponse';
import multer, { Options } from 'multer';
const multerOptions: Options = {
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf')
            cb(null, true);
        else cb(new APIError(
            RESPONSE_STATUS_CODES.BAD_REQUEST,
            'server only accepts pdf file'
        ) as unknown as null, false);
    }
};

const multerMiddleware = multer(multerOptions);

export const singleFileUpload = multerMiddleware.single('pdf-file');