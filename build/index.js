"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var debug_1 = __importDefault(require("debug"));
var app_1 = require("./app");
var normalizePort = function (val) {
    var port = parseInt(val, 10);
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
var port = normalizePort(process.env.PORT || '3000');
var server = http_1.default.createServer(app_1.app);
server.listen(port);
var onError = function (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
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
var onListening = function () {
    var addr = server.address();
    var bind = typeof addr === 'string' || addr === null ? 'pipe ' + addr : "port + " + addr.port;
    debug_1.default('Listening on ' + bind);
    console.log('Listening on ' + bind);
};
server.on('error', onError);
server.on('listening', onListening);
