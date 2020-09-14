import bodyParser from 'body-parser';
import status from 'http-status';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { checkJwt, generateString, connectDataBase } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { RETRIEVE_PATH } from '../constants';
import { ImagesGroup } from '../types';

export type ReqBody = {
    name?: string;
    description?: string;
    image_id_1?: string;
    image_id_2?: string;
    image_id_3?: string;
    product: boolean;
};

export const replace = router.put<ExpressPrams<{ id: string }>, ImagesGroup[] | string, ReqBody>(
    RETRIEVE_PATH,
    checkJwt,
    bodyParser.json(),
    async (req, res) => {
        const { name, description, image_id_1, image_id_2, image_id_3, product } = req.body;
        const params = {
            name,
            image_id_1,
            image_id_2,
            image_id_3,
            description,
            product,
        };

        const sql = generateString.replace({ table: TABLE_NAME, column: ID_NAME, params, searchPrams: req.params.id });

        try {
            await connectDataBase<ImagesGroup[]>(sql);
            const { rows } = await connectDataBase<ImagesGroup[]>(
                generateString.retrieve({ table: TABLE_NAME, column: ID_NAME, searchPrams: req.params.id }),
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
