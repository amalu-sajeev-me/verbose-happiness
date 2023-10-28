import { RequestHandler } from "express";
import { helmetMiddleware } from "./helmet";
import { bodyParserMiddlewares } from "./body-parser";
import { corsMiddleware } from "./cors";
import { morganMiddleware } from "./morgan";

export const middlewares: RequestHandler[] = [
    helmetMiddleware,
    corsMiddleware,
    morganMiddleware,
    ...bodyParserMiddlewares
];