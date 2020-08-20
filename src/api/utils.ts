import { Response, NextFunction, Request } from 'express';
import status from 'http-status';

export const secured = (req: Request<{ originalUrl: string }>, res: Response, next: NextFunction): void => {
    if (req.user) {
        return next();
    }

    if (typeof req.session !== 'undefined') {
        req.session.returnTo = req.originalUrl;
    }

    res.status(status.UNAUTHORIZED).send(status[401]);
};
