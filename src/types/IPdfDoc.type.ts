import { pdfDocSchema } from "src/schemas/pdfDoc.schema";
import { z } from "zod";

export type IPdfDoc = z.infer<typeof pdfDocSchema>;