# Nodejs-Typescript-esBuild-Pnpm-Template

> This template uses ts-node (-- SWC) for transpiling in dev and uses nodemon to watch
>

## Prerequisites
If you don't use the standalone script or @pnpm/exe to install pnpm, then you need to have Node.js (at least v16.14) to be installed on your system.

``npm install -g pnpm``

## usage

```bash
git clone https://github.com/amalu-sajeev-me/Nodejs-Typescript-esBuild-Pnpm-Template.git "your project name"
cd "your project name"
pnpm install
```


## features added

1. has built-in environment variables validation using zod schema. you can extend the process.env by adding fields to the ``env.schema.ts``
  ```typescript
     import { z } from 'zod';
     export const envSchema = z.object({
          PORT: z.string(),
          LOG_LEVEL: z.enum(['debug', 'info', 'error'])
      });
      export type IEnvVariables = z.infer<typeof envSchema>;
  ```
  > should use ``import '@bin/config';`` in your entry file for env schema validation.

2. has a logger configured to be injected. can be imported from ``@adapters/logger.adapter'``
   ```typescript
     import { LoggerAdapter } from '@adapters/logger.adapter';
     import { container } from 'tsyringe';
     // you can inject the logger to other services as well..
     const scream = container.resolve(LoggerAdapter);
     scream.info('hello world');
   ```
### Package.json
```json
{
  "name": "nodejs-typescript-swc-pnpm-template",
  "version": "1.0.0",
  "engines": {
    "node": "v18.18.1",
    "vscode": "^1.22.0"
  },
  "type": "commonjs",
  "description": "A template repository for future projects",
  "main": "dist/src/index.js",
  "scripts": {
    "lint": "npx eslint --fix",
    "build": "npx tsc -p ./tsconfig.json",
    "dev": "nodemon ./src/index.ts",
    "start": "pnpm build && node -r dotenv/config dist/src/index.js",
    "prepare": "husky install",
    "prepare-commit": "git-cz",
    "test": "echo 'test not written'",
    "postinstall": "link-module-alias"
  },
  "config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
  },
  "lint-staged": {
    "*.js": "eslint",
    "*.ts": "eslint"
  },
  "keywords": ["template", "pnpm", "nodejs", "typescript", "swc"],
  "author": {
    "name": "Amalu Sajeev",
    "email": "amalu.sajeev.me@gmail.com",
    "url": "https://github.com/amalu-sajeev-me/"
  },
  "bugs": {
    "url": "https://github.com/amalu-sajeev-me/Nodejs-Typescript-esBuild-Pnpm-Template/issues"
  },
  "license": "ISC",
  "devDependencies": {
    "@commitlint/cli": "^18.0.0",
    "@commitlint/config-conventional": "^18.0.0",
    "@commitlint/cz-commitlint": "^18.0.0",
    "@swc/core": "^1.3.95",
    "@types/node": "^20.8.7",
    "@typescript-eslint/eslint-plugin": "^6.9.0",
    "@typescript-eslint/parser": "^6.9.0",
    "commitizen": "^4.3.0",
    "concurrently": "^8.2.2",
    "eslint": "^8.52.0",
    "husky": "^8.0.0",
    "link-module-alias": "^1.2.0",
    "lint-staged": "^15.0.2",
    "nodemon": "^3.0.1",
    "ts-node": "^10.9.1",
    "typescript": "^5.2.2",
    "typescript-eslint-language-service": "^5.0.5"
  },
  "dependencies": {
    "dotenv": "^16.3.1",
    "pino": "^8.16.1",
    "pino-pretty": "^10.2.3",
    "reflect-metadata": "^0.1.13",
    "tslib": "^2.6.2",
    "tsyringe": "^4.8.0",
    "zod": "^3.22.4"
  },
  "_moduleAliases": {
    "@bin": "dist/bin",
    "@adapters": "dist/adapters"
  }
}
```
