import { format } from 'date-fns';
import dotenv from 'dotenv';
import status from 'http-status';
import request from 'supertest';
import { mockApp } from '../../test-utils';
import { PATH } from '../constants';
import { create, ReqBody } from '.';

dotenv.config();

describe(__filename, () => {
    test('疎通確認', async () => {
        const testData: ReqBody = {
            name: `test created by ${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}`,
            caption: `created for ${process.env.CREATED}`,
            image_id: 'd04281d7-3941-40e7-8e96-9e12244c7070',
            url: 'URL',
            product: false,
        };

        const response = await request(mockApp.use('/', create)).post(PATH).send(testData);

        expect(response.status).toBe(status.OK);
    });
});
