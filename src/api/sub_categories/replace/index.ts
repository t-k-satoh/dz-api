import bodyParser from 'body-parser';
import status from 'http-status';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { secured } from '../../utils';
import { connectDataBase } from '../../utils';
import { sqlReplace, sqlRetrieve } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { RETRIEVE_PATH } from '../constants';
import { SubCategory } from '../types';

export type ReqBody = Partial<Omit<SubCategory, 'sub_category_id' | 'created_at' | 'updated_at'>>;

export const replace = router.put<ExpressPrams<{ id: string }>, SubCategory[] | string, ReqBody>(
    RETRIEVE_PATH,
    secured(),
    bodyParser.json(),
    async (req, res) => {
        const { name, category_id, nick_name, product } = req.body;
        const params = { name, category_id, nick_name, product };

        const sql = sqlReplace({ table: TABLE_NAME, column: ID_NAME, params, searchPrams: req.params.id });

        try {
            await connectDataBase<SubCategory[]>(sql);
            const { rows } = await connectDataBase<SubCategory[]>(
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