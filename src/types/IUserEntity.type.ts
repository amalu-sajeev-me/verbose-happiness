import { z } from "zod";
import { userSchema } from "../schemas/user.schema";

export type IUserEntity = z.infer<typeof userSchema>;