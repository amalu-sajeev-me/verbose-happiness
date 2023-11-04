import { RESPONSE_STATUS_CODES } from "./ApiResponse";

export class APIError extends Error {
    constructor(
        public statusCode: RESPONSE_STATUS_CODES,
        public message: string,
        public info?: unknown
    ) {
        super(message, { cause: info });
        this.info = info instanceof Error ? info.message : info;
    }
}