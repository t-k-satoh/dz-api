import status from 'http-status';
import { routers } from '../api';
import { app } from './app';

export const newApp = app;

routers.forEach((router) => {
    newApp.use('/', router);
});

newApp.use('/', (_req, res) => {
    console.log('ないよ！');
    res.status(status.NOT_FOUND).send(status[404]);
});

newApp.get('/products', function (req, res) {
    console.log(req.params);
    res.send(req.params);
});

newApp.use((_req, _res, next) => {
    const err = new Error('Not Found');

    next({
        ...err,
        status: 404,
    });
});
