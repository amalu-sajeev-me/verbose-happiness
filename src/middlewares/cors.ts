import cors from 'cors';

const corsOptions: cors.CorsOptions = {};
export const corsMiddleware = cors(corsOptions);