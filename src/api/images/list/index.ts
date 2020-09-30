import status from 'http-status';
import { router } from '../../../app/router';
import { checkJwt, generateString, postgres } from '../../utils';
import { TABLE_NAME } from '../constants';
import { Image } from '../types';
import { PATH } from './constants';

export const list = router.get(PATH, checkJwt, async (_req, res) => {
    const client = postgres.generateClient();
    const sql = generateString.list({ table: TABLE_NAME });

    try {
        await client.connect();
        const { rows, rowCount } = await client.query<Image[]>(sql);

        res.status(status.OK).json({
            images: rows,
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
