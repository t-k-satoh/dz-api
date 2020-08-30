import status from 'http-status';
import { router } from '../../../app/router';
import { secured } from '../../utils';
import { connectDataBase } from '../../utils';
import { sqlList } from '../../utils';
import { TABLE_NAME } from '../constants';
import { PATH } from '../constants';
import { SubCategory } from '../types';

export const list = router.get(PATH, secured(), async (_req, res) => {
    const sql = sqlList({ table: TABLE_NAME });

    try {
        const { rows, rowCount } = await connectDataBase<SubCategory[]>(sql);

        res.status(status.OK).json({
            sub_categories: rows,
            page: {
                total_count: rowCount,
            },
        });
    } catch (error) {
        res.status(status.BAD_REQUEST).send(status[400]);
    }
});
