import bodyParser from 'body-parser';
import { format } from 'date-fns';
import dotenv from 'dotenv';
import status from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { connectDataBase, generateString, checkJwt } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { Image } from '../types';
import { connectedAWS, createPutObject } from '../utils';
import { PATH } from './constants';

dotenv.config();

export type ReqBody = {
    file?: File;
    product?: boolean;
};

export const replace = router.put<ExpressPrams<{ id: string }>, Image[] | string, ReqBody>(
    PATH,
    checkJwt,
    bodyParser.json(),
    async (req, res) => {
        try {
            const time = format(new Date(), 'yyyyMMddHHmmss');

            if (typeof req.body.file !== 'undefined') {
                const { name } = req.body.file;
                const objectParams = createPutObject(`${uuidv4()}_${time}_${name}`, req.body.file);
                const resForAWS = await connectedAWS.upload(objectParams).promise();

                const params = {
                    name,
                    url: resForAWS.Location,
                };

                const sql = generateString.replace({
                    table: TABLE_NAME,
                    column: ID_NAME,
                    params,
                    searchPrams: req.params.id,
                });

                await connectDataBase<Image[]>(sql);
            }

            const params = {
                product: req.body.product,
            };

            const sql = generateString.replace({
                table: TABLE_NAME,
                column: ID_NAME,
                params,
                searchPrams: req.params.id,
            });
            await connectDataBase<Image[]>(sql);

            const { rows } = await connectDataBase<Image[]>(
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
