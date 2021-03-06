import bodyParser from 'body-parser';
import status from 'http-status';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { checkJwt, generateString, postgres } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { RETRIEVE_PATH } from '../constants';
import { Product } from '../types';

export type ReqBody = Partial<Omit<Product, 'product_id' | 'created_at' | 'updated_at'>>;

export const replace = router.put<ExpressPrams<{ id: string }>, Product[] | string, ReqBody>(
    RETRIEVE_PATH,
    checkJwt,
    bodyParser.json(),
    async (req, res) => {
        const client = postgres.generateClient();
        const params = { updated_at: new Date().toISOString(), ...req.body };

        const sql = generateString.replace({ table: TABLE_NAME, column: ID_NAME, params, searchPrams: req.params.id });

        try {
            await client.connect();
            await client.query<Product[]>(sql);
            const { rows } = await client.query<Product[]>(
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
