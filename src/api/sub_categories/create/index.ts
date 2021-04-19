import bodyParser from 'body-parser';
import status from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { checkJwt, generateString, postgres } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { PATH } from '../constants';
import { SubCategory } from '../types';

export type ReqBody = Omit<SubCategory, 'sub_category_id' | 'created_at' | 'updated_at'>;

export const create = router.post<ExpressPrams<null>, SubCategory[] | string, ReqBody>(
    PATH,
    checkJwt,
    bodyParser.json(),
    async (req, res) => {
        const client = postgres.generateClient();
        const sub_category_id = uuidv4();
        const { name, category_id, nick_name, product } = req.body;
        const params = {
            sub_category_id,
            name,
            category_id,
            nick_name,
            product,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const sql = generateString.create({ table: TABLE_NAME, params });

        try {
            await client.connect();
            await client.query<SubCategory[]>(sql);
            const { rows } = await client.query<SubCategory[]>(
                generateString.retrieve({ table: TABLE_NAME, column: ID_NAME, searchPrams: sub_category_id }),
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
