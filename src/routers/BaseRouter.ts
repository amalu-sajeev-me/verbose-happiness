import { RequestHandler, Router } from "express";

type IHttpMethods = 'get' | 'post';

export abstract class BaseRouter<TController = unknown>{
    protected abstract _controller: TController;
    protected abstract _router: Router;
    public abstract main(): this;
    public get instance() {
        return this._router;
    }
    protected add(method: IHttpMethods, path: `/${string}`, ...reqHandlers: RequestHandler[]) {
        this._router[method](path,...reqHandlers);
    }
}