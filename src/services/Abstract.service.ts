import { LoggerAdapter } from "@adapters/logger.adapter";
import { container } from "tsyringe";

export abstract class AbstractService<TModel> {
    protected abstract _Model: TModel;
    protected _scream: LoggerAdapter = container.resolve(LoggerAdapter);
}