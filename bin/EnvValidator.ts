import { z } from 'zod';
import { container } from 'tsyringe';
import { LoggerAdapter } from '../src/adapters/logger.adapter';
import { envSchema } from './env.schema';

class EnvValidator{
    private static scream = container.resolve(LoggerAdapter);

    public static ENV_SCHEMA = envSchema;

    public static validatedEnvObj: z.infer<typeof envSchema> | null = null;

    public static validate = () => {
        try {
            const data = this.ENV_SCHEMA.parse(process.env);
            this.validatedEnvObj = data;
            this.scream.info('environment variables validated succesfully', 'EnvValidator.ts');
            return true;
        } catch (error) {
            this.scream.error('Error in validating the environment variables');
            throw error;
        }
    };
}

export const envProxy = new Proxy(EnvValidator, {
    get(target, prop) {
        if (prop === 'validate') return target['validate'];
        if (prop === 'validatedEnvObj' && target.validatedEnvObj)
            return target.validatedEnvObj;
        throw new Error('must validate the environment variables before accesing');
    }
}) as Pick<typeof EnvValidator, 'validate' | 'validatedEnvObj'>;