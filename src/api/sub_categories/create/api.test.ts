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
            nick_name: `created for ${process.env.CREATED}`,
            category_id: 'd852e9da-777a-4974-9af8-9cdea5b5a82a',
            product: false,
        };

        const response = await request(mockApp.use('/', create)).post(PATH).send(testData);

        expect(response.status).toBe(status.OK);
    });
});
