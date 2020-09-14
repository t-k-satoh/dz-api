import bodyParser from 'body-parser';
import status from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { checkJwt, generateString, connectDataBase } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { PATH } from '../constants';
import { KeyVisual } from '../types';

export type ReqBody = Omit<KeyVisual, 'key_visual_id' | 'created_at' | 'updated_at'>;

export const create = router.post<ExpressPrams<null>, KeyVisual[] | string, ReqBody>(
    PATH,
    checkJwt,
    bodyParser.json(),
    async (req, res) => {
        const key_visual_id = uuidv4();
        const { name, caption, image_id, url, product } = req.body;
        const params = {
            key_visual_id,
            name,
            caption,
            image_id,
            url,
            product,
        };

        const sql = generateString.create({ table: TABLE_NAME, params });

        try {
            await connectDataBase<KeyVisual[]>(sql);
            const { rows } = await connectDataBase<KeyVisual[]>(
                generateString.retrieve({ table: TABLE_NAME, column: ID_NAME, searchPrams: key_visual_id }),
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
