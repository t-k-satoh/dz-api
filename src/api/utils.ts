import * as dotenv from 'dotenv';
import { Response, NextFunction, Request } from 'express';
import status from 'http-status';
import mysql from 'mysql';

dotenv.config();

export const secured = <Params>() => (
    req: Request<{ originalUrl: string } & Params>,
    res: Response,
    next: NextFunction,
): void => {
    if (req.user) {
        return next();
    }

    if (typeof req.session !== 'undefined') {
        req.session.returnTo = req.originalUrl;
    }

    res.status(status.UNAUTHORIZED).send(status[401]);
};

export const connectDataBase = <Results>(query: mysql.QueryOptions): Promise<Results> => {
    return new Promise((resolve, reject) => {
        mysql
            .createPool({
                host: process.env.DB_HOST_NAME,
                user: process.env.DB_USER_NAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            })
            .getConnection((err, connection) => {
                if (err) {
                    return reject(err);
                }
                connection.query(query, (error, results) => {
                    connection.release();

                    if (error) {
                        return reject(error);
                    }

                    return resolve(results);
                });
            });
    });
};
