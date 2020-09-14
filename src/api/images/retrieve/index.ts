import status from 'http-status';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { checkJwt, generateString } from '../../utils';
import { connectDataBase } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { Image } from '../types';
import { PATH } from './constants';

export const retrieve = router.get<ExpressPrams<{ id: string }>>(PATH, checkJwt, async (req, res) => {
    const sql = generateString.retrieve({ table: TABLE_NAME, column: ID_NAME, searchPrams: req.params.id });

    try {
        const { rows } = await connectDataBase<Image[]>(sql);

        if (rows.length === 0) {
            res.status(status.BAD_REQUEST).send(status[400]);
        }

        res.status(status.OK).json(rows[0]);
    } catch (error) {
        res.status(status.BAD_REQUEST).send(status[400]);
    }
});
