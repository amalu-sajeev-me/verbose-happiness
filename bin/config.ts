import './ioc.register';
import type { IEnvVariables } from "./env.schema";
import { envProxy } from './EnvValidator';

declare global {
/* eslint-disable @typescript-eslint/no-namespace */
    namespace NodeJS {
        interface ProcessEnv extends IEnvVariables { }
    }
/* eslint-enable @typescript-eslint/no-namespace */
}

(function validateEnvironmentVariables() {
    envProxy.validate();
})();