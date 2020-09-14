import status from 'http-status';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { connectDataBase, generateString, checkJwt } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { PATH } from './constants';

export const _delete = router.delete<ExpressPrams<{ id: string }>>(PATH, checkJwt, async (req, res) => {
    const sql = generateString._delete({ table: TABLE_NAME, column: ID_NAME, searchPrams: req.params.id });

    try {
        await connectDataBase(sql);

        res.status(status.NO_CONTENT).send(status[204]);
    } catch (error) {
        res.status(status.BAD_REQUEST).send(status[400]);
    }
});
