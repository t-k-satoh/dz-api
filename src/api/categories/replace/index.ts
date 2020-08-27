import bodyParser from 'body-parser';
import status from 'http-status';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { secured } from '../../utils';
import { connectDataBase } from '../../utils';
import { sqlReplace, sqlRetrieve } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { Category } from '../types';
import { PATH } from './constants';

export type ReqBody = {
    name?: string;
    nick_name?: string;
    isProduct?: boolean;
};

export const replace = router.put<ExpressPrams<{ id: string }>, Category[] | string, ReqBody>(
    PATH,
    secured(),
    bodyParser.json(),
    async (req, res) => {
        const { name, nick_name, isProduct } = req.body;
        const params = {
            name,
            nick_name,
            product: isProduct,
        };

        const sql = sqlReplace({ table: TABLE_NAME, column: ID_NAME, params, searchPrams: req.params.id });

        try {
            await connectDataBase<Category[]>(sql);
            const { rows } = await connectDataBase<Category[]>(
                sqlRetrieve({ table: TABLE_NAME, column: ID_NAME, searchPrams: req.params.id }),
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
