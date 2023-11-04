import { userSchema } from "@schemas/user.schema";
import { APIError } from "@utils/APIError";
import { RESPONSE_STATUS_CODES } from "@utils/ApiResponse";
import { RequestHandler } from "express";
import { z } from "zod";

export const requestBodyValidate = <
    Tschema extends z.AnyZodObject
    >(
        zodSchema: Tschema,
        fields?: (keyof z.infer<Tschema>)[]
    ): RequestHandler => (
    request, _response, next
) => {
    try {
        const { body } = request;
        if (!fields) {
            request.body = zodSchema.parse(body);
            return next();
        } else {
            const selectedFields = (fields).reduce((prev, curr) => {
                prev[curr] = true;
                return { ...prev };
            }, {} as Record<keyof z.infer<Tschema>, true>);
            const selectiveSchema = zodSchema.pick(selectedFields);
            request.body = selectiveSchema.parse(body);
            return next();
        }
    } catch (error) {
        const errorsObject = {} as Record<string, unknown>;
        const isZodError = error instanceof z.ZodError;
        if (isZodError) {
            const flattenedErrors = error.flatten();
            for (const [path, message] of Object.entries(flattenedErrors)) {
                errorsObject[path] = message;
            }
        }
        next(new APIError(
            RESPONSE_STATUS_CODES.BAD_REQUEST,
            'invalid payload recieved in the body',
            isZodError ? errorsObject: error
        ));
    }
}

requestBodyValidate(userSchema, ['email']);