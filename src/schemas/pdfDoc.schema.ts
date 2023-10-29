import { z } from "zod";
import { CloudinaryResponseSchema } from "./CloudinaryResponse.schema";

export const pdfDocSchema = z.object({
    fileName: z.string(),
    // owner: userSchema,
    storageData: CloudinaryResponseSchema
});
