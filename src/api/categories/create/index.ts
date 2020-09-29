import bodyParser from 'body-parser';
import status from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { connectDataBase, generateString, checkJwt } from '../../utils';
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
        const category_id = uuidv4();
        const { name, nick_name, product } = req.body;
        const params = {
            category_id,
            name,
            nick_name,
            product,
        };

        const sql = generateString.create({ table: TABLE_NAME, params });

        try {
            await connectDataBase<Category[]>(sql);
            const { rows } = await connectDataBase<Category[]>(
                generateString.retrieve({ table: TABLE_NAME, column: ID_NAME, searchPrams: category_id }),
            );

            if (rows.length === 0) {
                res.status(status.BAD_REQUEST).send(status[400]);
            }

            res.status(status.OK).json(rows[0]);
        } catch (error) {
            res.status(status.BAD_REQUEST).send(status[400]);
        }
    },
);
