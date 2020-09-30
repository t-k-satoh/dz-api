import status from 'http-status';
import { router } from '../../../app/router';
import { checkJwt, generateString, postgres } from '../../utils';
import { TABLE_NAME } from '../constants';
import { PATH } from '../constants';
import { ImagesGroup } from '../types';

export const list = router.get(PATH, checkJwt, async (_req, res) => {
    const client = postgres.generateClient();
    const sql = generateString.list({ table: TABLE_NAME });

    try {
        await client.connect();
        const { rows, rowCount } = await client.query<ImagesGroup[]>(sql);

        res.status(status.OK).json({
            images_groups: rows,
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
