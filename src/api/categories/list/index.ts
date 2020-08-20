import status from 'http-status';
import { router } from '../../../app/router';
import { secured } from '../../utils';
import { connectDataBase } from '../../utils';
import { Category } from '../types';
import { PATH } from './constants';

export const list = router.get(PATH, secured(), async (_req, res) => {
    const sql = `SELECT * FROM categories`;

    try {
        const categories = await connectDataBase<Category[]>({ sql });
        const page = {
            total_count: categories.length,
        };

        res.status(status.OK).json({ categories, page });
    } catch (error) {
        res.status(status.BAD_REQUEST).send(status[400]);
    }
});
