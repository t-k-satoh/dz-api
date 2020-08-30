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
            sub_category_id: '547bb826-e9ae-4144-8c0f-57bc38eb4057',
            images_group_id: '8758d1c6-24d8-47a6-a402-b72d049d2c94',
            suzuri_id: 'suzuri_id',
            recommend: false,
            new: false,
            product: false,
            description: `created for ${process.env.CREATED}`,
            release_date: '2020-08-30 13:54:50.893765+09',
        };

        const response = await request(mockApp.use('/', create)).post(PATH).send(testData);

        expect(response.status).toBe(status.OK);
    });
});
