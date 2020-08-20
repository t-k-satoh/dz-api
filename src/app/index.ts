import { routers } from '../api';
import { app } from './app';

export const newApp = app;

routers.forEach((router) => {
    newApp.use('/', router);
});

newApp.use('/', (req, res) => {
    if (typeof req.user === 'undefined') {
        res.status(401);
        res.send('fail');
        return;
    }

    const userProfile = req.user;

    res.send(JSON.stringify(userProfile));
});

newApp.use((_req, _res, next) => {
    const err = new Error('Not Found');

    next({
        ...err,
        status: 404,
    });
});
