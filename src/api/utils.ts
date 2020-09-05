import * as dotenv from 'dotenv';
import { Response, NextFunction, Request } from 'express';
import status from 'http-status';
import { Pool, QueryResult } from 'pg';

dotenv.config();

export const secured = () => (req: Request<{ originalUrl: string }>, res: Response, next: NextFunction): void => {
    console.log(req);

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

export const sqlList = ({ table }: { table: string }): string => `SELECT * FROM public.${table}`;

export const sqlRetrieve = ({
    table,
    column,
    searchPrams,
}: {
    table: string;
    column: string;
    searchPrams: string;
}): string => `SELECT * FROM public.${table} WHERE ${column} = '${searchPrams}'`;

export const sqlCreate = ({
    table,
    params,
}: {
    table: string;
    params: { [key: string]: string | number | boolean | undefined };
}): string => {
    const keys = Object.keys(params).join(', ');
    const values = Object.values(params)
        .map((params) => (typeof params === 'undefined' ? null : params))
        .map((params) => `'${params}'`)
        .join(', ');

    return `INSERT INTO public.${table} (${keys}) VALUES (${values});`;
};

export const sqlReplace = ({
    table,
    column,
    params,
    searchPrams,
}: {
    table: string;
    column: string;
    params: { [key: string]: string | number | boolean | undefined };
    searchPrams: string;
}): string => {
    const properties = Object.entries(params)
        .filter((entry) => typeof entry[1] !== 'undefined')
        .map((entry) => {
            const key = entry[0];
            const value = entry[1];

            if (typeof value === 'string') {
                return `${key} = '${value}'`;
            }

            return `${key} = ${value}`;
        })
        .join(', ');

    return `UPDATE public.${table} SET ${properties} WHERE ${column} = '${searchPrams}';`;
};

export const sqlDelete = ({
    table,
    column,
    searchPrams,
}: {
    table: string;
    column: string;
    searchPrams: string;
}): string => `DELETE FROM public.${table} WHERE ${column} IN ('${searchPrams}');`;
