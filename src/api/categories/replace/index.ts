import bodyParser from 'body-parser';
import status from 'http-status';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { postgres, checkJwt, generateString } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { Category } from '../types';
import { PATH } from './constants';

export type ReqBody = {
    name?: string;
    nick_name?: string;
    product?: boolean;
};

export const replace = router.put<ExpressPrams<{ id: string }>, Category[] | string, ReqBody>(
    PATH,
    checkJwt,
    bodyParser.json(),
    async (req, res) => {
        const client = postgres.generateClient();

        const { name, nick_name, product } = req.body;
        const params = {
            name,
            nick_name,
            product,
        };

        const sql = generateString.replace({ table: TABLE_NAME, column: ID_NAME, params, searchPrams: req.params.id });

        try {
            await client.connect();

            await client.query<Category[]>(sql);
            const { rows } = await client.query<Category[]>(
                generateString.retrieve({ table: TABLE_NAME, column: ID_NAME, searchPrams: req.params.id }),
            );

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
