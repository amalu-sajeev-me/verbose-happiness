import { z } from "zod";
import { CloudinaryResponseSchema } from "@schemas/CloudinaryResponse.schema";

export const pdfDocSchema = z.object({
    fileName: z.string(),
    // owner: userSchema,
    storageData: CloudinaryResponseSchema
});
