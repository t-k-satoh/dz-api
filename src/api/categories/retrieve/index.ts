import status from 'http-status';
import { router } from '../../../app/router';
import { secured } from '../../utils';
import { connectDataBase } from '../../utils';
import { Category } from '../types';
import { PATH } from './constants';

export const retrieve = router.get(PATH, secured<{ id: string }>(), async (req, res) => {
    const sql = `SELECT * FROM public.categories WHERE category_id = '${req.params.id}'`;

    try {
        const { rows } = await connectDataBase<Category[]>(sql);

        if (rows.length === 0) {
            res.status(status.BAD_REQUEST).send(status[400]);
        }

        res.status(status.OK).json(rows[0]);
    } catch (error) {
        res.status(status.BAD_REQUEST).send(status[400]);
    }
});
