import bodyParser from 'body-parser';
import status from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { generateString, checkJwt, postgres } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { Category } from '../types';
import { PATH } from './constants';

export type ReqBody = {
    name: string;
    nick_name: string;
    product: boolean;
};

export const create = router.post<ExpressPrams<null>, Category[] | string, ReqBody>(
    PATH,
    checkJwt,
    bodyParser.json(),
    async (req, res) => {
        const client = postgres.generateClient();

        const category_id = uuidv4();
        const { name, nick_name, product } = req.body;
        const params = {
            category_id,
            name,
            nick_name,
            product,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const sql = generateString.create({ table: TABLE_NAME, params });

        try {
            await client.connect();

            await client.query(sql);

            const retrieve = generateString.retrieve({ table: TABLE_NAME, column: ID_NAME, searchPrams: category_id });

            const { rows } = await client.query<Category[]>(retrieve);

            if (rows.length === 0) {
                res.status(status.BAD_REQUEST).send(status[400]);
            }

            res.status(status.OK).json(rows[0]);
        } catch (error) {
            res.status(status.BAD_REQUEST).send(status[400]);
        } finally {
            await client.end();
        }
    },
);
