import helmet from 'helmet';
type IHelmetOptions = Parameters<typeof helmet>[0];

const helmetOptions: IHelmetOptions = {}
export const helmetMiddleware = helmet(helmetOptions);