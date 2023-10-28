import { IEnvVariables } from "@bin/env.schema";

export class EnvironmentUtil {
    static isDevelopment(): boolean {
        return process.env.NODE_ENV === 'development';
    }

    static isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }

    static isTesting(): boolean {
        return process.env.NODE_ENV === 'testing';
    }

    static getCurrentEnvironment(): IEnvVariables['NODE_ENV'] {
        return process.env.NODE_ENV || 'development';
    }

    static requireEnvVariable(variableName: string): void {
        if (!process.env[variableName]) {
            throw new Error(`Environment variable '${variableName}' is not set.`);
        }
    }
}
