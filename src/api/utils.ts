import * as dotenv from 'dotenv';
import { Response, NextFunction, Request } from 'express';
import status from 'http-status';
import { Pool, QueryResult } from 'pg';

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

export const connectDataBase = <Results>(queryTextOrConfig: string): Promise<QueryResult<Results>> => {
    return new Promise((resolve, reject) => {
        const pool = new Pool({
            user: process.env.DB_USER_NAME,
            host: process.env.DB_HOST_NAME,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
            ssl: {
                rejectUnauthorized: false,
            },
        });

        pool.connect((error) => {
            if (error) {
                return reject(error);
            }
        });

        pool.query(queryTextOrConfig, (error, res) => {
            if (error) {
                return reject(error);
            }

            return resolve(res);
        });
    });
};
