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
            description: `created for ${process.env.CREATED}`,
            image_id_1: 'd04281d7-3941-40e7-8e96-9e12244c7070',
            image_id_2: '6704b9c8-9cf4-48a9-812b-282ea8431275',
            image_id_3: '61ce700c-6506-4f09-a656-8adf3f838963',
            product: false,
        };

        const response = await request(mockApp.use('/', create)).post(PATH).send(testData);

        expect(response.status).toBe(status.OK);
    });
});
