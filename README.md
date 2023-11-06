# PDF Page Extractor

> This setup uses ts-node (-- SWC) for transpiling in dev and uses nodemon to watch
>

## Prerequisites
If you don't use the standalone script or @pnpm/exe to install pnpm, then you need to have Node.js (at least v16.14) to be installed on your system.

``npm install -g pnpm``

## Local Setup

> The local setup requires you to set up the environment variables. which also includes the API keys from Cloudinary. you can get the API keys from Cloudinary by creating an account. or you can use the already setup and hosted API here http://verbose-happiness-api.onrender.com/

## usage

```bash
git clone https://github.com/amalu-sajeev-me/Nodejs-Typescript-esBuild-Pnpm-Template.git "your project name"
cd "your project name"
pnpm install;
pnpm build;
pnpm start;
```

### Postman Documentation
> The API documentation for the endpoints in the server can be found at this link -> https://documenter.getpostman.com/view/18518642/2s9YXfcich
>

### About the Implementation

from zero to everything is handwritten in this project including the project setup and configurations. 
1. The project is primarily built upon express.js.
2. Uses MongoDB as the database.
3. Uses Cloudinary for storage.

> Every time the user uploads a PDF file, it's sent to the Cloudinary storage, and upon success, the metadata from the response along with other related data of the file is saved into the database. mostly when the user sends a request to the server, the server reaches out to the database instead of the storage, unless its a request to download the file.
> similarly, when the user sends a request to extract certain pages of a file that is already uploaded in the server, a copy of the newly extracted file is saved to the Cloudinary Storage and the meta data is saved to mongodb. 
