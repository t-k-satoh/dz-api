import status from 'http-status';
import { router } from '../../../app/router';
import { checkJwt, generateString, connectDataBase } from '../../utils';
import { TABLE_NAME } from '../constants';
import { Image } from '../types';
import { PATH } from './constants';

export const list = router.get(PATH, checkJwt, async (_req, res) => {
    const sql = generateString.list({ table: TABLE_NAME });

    try {
        const { rows, rowCount } = await connectDataBase<Image[]>(sql);

        res.status(status.OK).json({
            images: rows,
            page: {
                total_count: rowCount,
            },
        });
    } catch (error) {
        res.status(status.BAD_REQUEST).send(status[400]);
    }
});
