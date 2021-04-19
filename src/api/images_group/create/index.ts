import bodyParser from 'body-parser';
import status from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { checkJwt, generateString, postgres } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { PATH } from '../constants';
import { ImagesGroup } from '../types';

export type ReqBody = {
    name: string;
    description: string;
    image_id_1: string;
    image_id_2?: string;
    image_id_3?: string;
    product: boolean;
};

export const create = router.post<ExpressPrams<null>, ImagesGroup[] | string, ReqBody>(
    PATH,
    checkJwt,
    bodyParser.json(),
    async (req, res) => {
        const client = postgres.generateClient();

        const images_group_id = uuidv4();
        const { name, description, image_id_1, image_id_2, image_id_3, product } = req.body;
        const params = {
            images_group_id,
            name,
            image_id_1,
            image_id_2,
            image_id_3,
            description,
            product,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const sql = generateString.create({ table: TABLE_NAME, params });

        try {
            await client.connect();

            await client.query(sql);

            const { rows } = await client.query<ImagesGroup[]>(
                generateString.retrieve({ table: TABLE_NAME, column: ID_NAME, searchPrams: images_group_id }),
            );

            if (rows.length === 0) {
                res.status(status.BAD_REQUEST).send(status[400]);
            }

            res.status(status.OK).json(rows[0]);
        } catch (error) {
            res.status(status.BAD_REQUEST).send(status[400]);
        } finally {
            await client.end();
        }
    },
);
