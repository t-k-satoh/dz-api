import status from 'http-status';
// import { routers } from '../api';
import { app } from './app';

export const newApp = app;

newApp.use('/', (_req, res) => {
    console.log('ないよ！');
    res.status(status.NOT_FOUND).send(status[404]);
});
