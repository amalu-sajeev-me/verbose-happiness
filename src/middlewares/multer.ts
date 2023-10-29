import multer, { Options } from 'multer';
const multerOptions: Options = {};

const multerMiddleware = multer(multerOptions);

export const singleFileUpload = multerMiddleware.single('pdf-file');