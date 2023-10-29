import { CloudinaryResponseSchema } from "../schemas/CloudinaryResponse.schema";
import { z } from "zod";

export type ICloudinaryResponse = z.infer<typeof CloudinaryResponseSchema>;