import { Client } from 'pg';

export const generateClient = (): Client =>
    new Client({
        user: process.env.DB_USER_NAME,
        host: process.env.DB_HOST_NAME,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
        ssl: {
            rejectUnauthorized: false,
        },
        query_timeout: 50000,
    });
