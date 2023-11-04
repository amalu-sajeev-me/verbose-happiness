import { z } from "zod";

export const userSchema = z.object({
    firstName: z.string().min(3).max(16),
    lastName: z.string().min(1).max(16),
    email: z.string().email(),
    password: z.string().min(8).max(32)
});
