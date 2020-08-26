import express from 'express';

export const mockApp = express().all('*', (req, _res, next) => {
    req.user = true;
    next();
});
