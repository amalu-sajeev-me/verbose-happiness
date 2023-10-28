import 'module-alias/register';
import '@bin/config';
import { container } from 'tsyringe';
import { Server } from './server';

(function main() {
    const server = container.resolve(Server);
    server.startListening();
})();