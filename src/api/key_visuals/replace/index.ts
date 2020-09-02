import bodyParser from 'body-parser';
import status from 'http-status';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { secured } from '../../utils';
import { connectDataBase } from '../../utils';
import { sqlReplace, sqlRetrieve } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { RETRIEVE_PATH } from '../constants';
import { KeyVisual } from '../types';

export type ReqBody = Partial<Omit<KeyVisual, 'key_visual_id' | 'created_at' | 'updated_at'>>;

export const replace = router.put<ExpressPrams<{ id: string }>, KeyVisual[] | string, ReqBody>(
    RETRIEVE_PATH,
    secured(),
    bodyParser.json(),
    async (req, res) => {
        const { name, caption, image_id, url, product } = req.body;
        const params = {
            name,
            caption,
            image_id,
            url,
            product,
        };

        const sql = sqlReplace({ table: TABLE_NAME, column: ID_NAME, params, searchPrams: req.params.id });

        try {
            await connectDataBase<KeyVisual[]>(sql);
            const { rows } = await connectDataBase<KeyVisual[]>(
                sqlRetrieve({ table: TABLE_NAME, column: ID_NAME, searchPrams: req.params.id }),
            );

            if (rows.length === 0) {
                res.status(status.BAD_REQUEST).send(status[400]);
            }

            res.status(status.OK).json(rows[0]);
        } catch (error) {
            res.status(status.BAD_REQUEST).send(status[400]);
        }
    },
);