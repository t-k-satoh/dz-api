import status from 'http-status';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { postgres, checkJwt, generateString } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { Category } from '../types';
import { PATH } from './constants';

export const retrieve = router.get<ExpressPrams<{ id: string }>>(PATH, checkJwt, async (req, res) => {
    const client = postgres.generateClient();
    const sql = generateString.retrieve({ table: TABLE_NAME, column: ID_NAME, searchPrams: req.params.id });

    try {
        await client.connect();
        const { rows } = await client.query<Category[]>(sql);

        if (rows.length === 0) {
            res.status(status.BAD_REQUEST).send(status[400]);
        }

        res.status(status.OK).json(rows[0]);
    } catch (error) {
        res.status(status.BAD_REQUEST).send(status[400]);
    } finally {
        await client.end();
    }
});
