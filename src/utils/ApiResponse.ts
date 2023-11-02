type IApiResponseStatus = 'success' | 'failure';
export class ApiResponse<TResponseObject extends Record<string, unknown> = Record<string, unknown>>{
    constructor(
        public readonly responseData: TResponseObject,
        public readonly status: IApiResponseStatus,
        public readonly message?: string
    ){}
}