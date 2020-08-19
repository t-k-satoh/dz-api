import http from 'http';
import debug from 'debug';
import { app } from './app';

const normalizePort = (val: string) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

const port = normalizePort(process.env.PORT || '3000');

const server = http.createServer(app);

server.listen(port);

const onError = (error: any) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' || addr === null ? 'pipe ' + addr : `port + ${addr.port}`;
    debug('Listening on ' + bind);
    console.log('Listening on ' + bind);
};

server.on('error', onError);
server.on('listening', onListening);
