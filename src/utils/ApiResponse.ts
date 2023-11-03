export const enum RESPONSE_STATUS_CODES{
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_fOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503
}

type IApiResponseStatus = 'success' | 'failure';
export class ApiResponse<TResponseObject extends Record<string, unknown> = Record<string, unknown>>{
    public statusCode: RESPONSE_STATUS_CODES = RESPONSE_STATUS_CODES.OK;
    constructor(
        public readonly responseData: TResponseObject,
        public readonly status: IApiResponseStatus,
        public readonly message?: string
    ) { }
    public withStatus(code: RESPONSE_STATUS_CODES) {
        this.statusCode = code;
        return this;
    }
}