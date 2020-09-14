import * as dotenv from 'dotenv';
import { Pool, QueryResult } from 'pg';

dotenv.config();

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
