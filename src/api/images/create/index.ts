import fs from 'fs';
import bodyParser from 'body-parser';
import status from 'http-status';
import { format } from 'date-fns';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { router } from '../../../app/router';
import { ExpressPrams } from '../../types';
import { connectDataBase, sqlCreate, sqlRetrieve, secured } from '../../utils';
import { TABLE_NAME, ID_NAME } from '../constants';
import { connectedAWS, createPutObject } from '../utils';
import { PATH } from './constants';

dotenv.config();

export type ReqBody = {
    file_path: string;
};

export const create = router.post<ExpressPrams<null>, string, ReqBody>(
    PATH,
    secured(),
    bodyParser.json(),
    async (req, res) => {
        const time = format(new Date(), 'yyyyMMddHHmmss');
        const buffer = fs.readFileSync(req.body.file_path);
        const splitPath = req.body.file_path.split('/');
        const fileName = splitPath[splitPath.length - 1];

        const params = createPutObject(`${uuidv4()}_${time}_${fileName}`, buffer);

        const resForAWS = await connectedAWS.upload(params).promise();

        console.log(resForAWS.Location);

        res.status(status.OK).json('ok');
    },
);
