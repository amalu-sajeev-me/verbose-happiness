import { z } from 'zod';

export const envSchema = z.object({
    PORT: z.string(),
    LOG_LEVEL: z.enum(['debug', 'info', 'error']),
    NODE_ENV: z.enum(['development', 'testing', 'production']).default('development'),
    PRIMARY_DB_CONN_URL: z.string().url()
});

export type IEnvVariables = z.infer<typeof envSchema>;
