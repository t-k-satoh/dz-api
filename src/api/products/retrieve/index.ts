import status from 'http-status';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { secured, sqlRetrieve } from '../../utils';
import { connectDataBase } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { RETRIEVE_PATH } from '../constants';
import { Product } from '../types';

export const retrieve = router.get<ExpressPrams<{ id: string }>>(RETRIEVE_PATH, secured(), async (req, res) => {
    const sql = sqlRetrieve({ table: TABLE_NAME, column: ID_NAME, searchPrams: req.params.id });

    try {
        const { rows } = await connectDataBase<Product[]>(sql);

        if (rows.length === 0) {
            res.status(status.BAD_REQUEST).send(status[400]);
        }

        res.status(status.OK).json(rows[0]);
    } catch (error) {
        res.status(status.BAD_REQUEST).send(status[400]);
    }
});
