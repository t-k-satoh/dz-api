import cors from 'cors';
import status from 'http-status';
import { routers } from '../api';
import { app } from './app';

export const newApp = app;

routers.forEach((router) => {
    newApp.use('/', router);
    router.all('*', cors());
});

newApp.use('/', (_req, res) => {
    res.status(status.NOT_FOUND).send(status[404]);
});

newApp.use((_req, _res, next) => {
    const err = new Error('Not Found');

    next({
        ...err,
        status: 404,
    });
});
