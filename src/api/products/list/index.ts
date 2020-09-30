import status from 'http-status';
import { router } from '../../../app/router';
import { generateString, postgres } from '../../utils';
import { TABLE_NAME } from '../constants';
import { PATH } from '../constants';
import { Product } from '../types';

export const list = router.get(PATH, async (_req, res) => {
    const client = postgres.generateClient();

    const sql = generateString.list({ table: TABLE_NAME });

    try {
        await client.connect();
        const { rows, rowCount } = await client.query<Product[]>(sql);

        res.status(status.OK).json({
            products: rows,
            page: {
                total_count: rowCount,
            },
        });
    } catch (error) {
        res.status(status.BAD_REQUEST).send(status[400]);
    } finally {
        await client.end();
    }
});
