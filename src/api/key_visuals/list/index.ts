import status from 'http-status';
import { router } from '../../../app/router';
import { checkJwt, generateString, connectDataBase } from '../../utils';
import { TABLE_NAME } from '../constants';
import { PATH } from '../constants';
import { KeyVisual } from '../types';

export const list = router.get(PATH, checkJwt, async (_req, res) => {
    const sql = generateString.list({ table: TABLE_NAME });

    try {
        const { rows, rowCount } = await connectDataBase<KeyVisual[]>(sql);

        res.status(status.OK).json({
            key_visuals: rows,
            page: {
                total_count: rowCount,
            },
        });
    } catch (error) {
        res.status(status.BAD_REQUEST).send(status[400]);
    }
});
