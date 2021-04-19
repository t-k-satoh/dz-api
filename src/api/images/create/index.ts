import bodyParser from 'body-parser';
import { format } from 'date-fns';
import dotenv from 'dotenv';
import status from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { postgres, generateString, checkJwt } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { Image } from '../types';
import { connectedAWS, createPutObject } from '../utils';
import { PATH } from './constants';

dotenv.config();

export type ReqBody = {
    file: File;
    product: boolean;
};

export const create = router.post<ExpressPrams<null>, Image[] | string, ReqBody>(
    PATH,
    checkJwt,
    bodyParser.json(),
    async (req, res) => {
        const client = postgres.generateClient();

        const time = format(new Date(), 'yyyyMMddHHmmss');
        const { name } = req.body.file;

        try {
            await client.connect();
            const objectParams = createPutObject(`${uuidv4()}_${time}_${name}`, req.body.file);
            const resForAWS = await connectedAWS.upload(objectParams).promise();

            const image_id = uuidv4();

            const params = {
                image_id,
                name,
                url: resForAWS.Location,
                product: req.body.product,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const sql = generateString.create({ table: TABLE_NAME, params });
            await client.query(sql);

            const retrieve = generateString.retrieve({ table: TABLE_NAME, column: ID_NAME, searchPrams: image_id });
            const { rows } = await client.query<Image[]>(retrieve);

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
