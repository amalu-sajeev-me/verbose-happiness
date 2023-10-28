import { RequestHandler } from "express";

export class UserController{
    [index: string]: RequestHandler;
    public createUser: RequestHandler = (_req, res) => {
        res.send('hello world')
    };
}