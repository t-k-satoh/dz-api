import fs from 'fs';
import bodyParser from 'body-parser';
import status from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { connectDataBase, sqlCreate, sqlRetrieve, secured } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { connectedAWS, createPutObject } from '../utils';
import { PATH } from './constants';

export type ReqBody = {
    file: File;
};

export const create = router.post<ExpressPrams<null>, string, ReqBody>(
    PATH,
    secured(),
    bodyParser.json(),
    async (req, res) => {
        const file = req.body.file;
        const { name, lastModified, type } = file;

        const params = createPutObject(`${name}-${lastModified}.${type}`, req.body.file);

        const resForAWS = await connectedAWS.upload(params).promise();

        console.log(resForAWS.Location);

        res.status(status.OK).json('ok');
    },
);
