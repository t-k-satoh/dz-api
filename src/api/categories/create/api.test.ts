import { format } from 'date-fns';
import dotenv from 'dotenv';
import status from 'http-status';
import request from 'supertest';
import { mockApp } from '../../test-utils';
import { Result } from '../types';
import { PATH } from './constants';
import { create, ReqBody } from '.';

dotenv.config();

describe(__filename, () => {
    test('疎通確認', async () => {
        const testData: ReqBody = {
            name: `test created by ${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}`,
            nick_name: `created for ${process.env.CREATED}`,
            product: false,
        };

        const response = await request(mockApp.use('/', create)).post(PATH).send(testData);

        expect(response.status).toBe(status.OK);

        const body: Result['categories'][number] = response.body;

        expect('category_id' in body).toBe(true);
        expect('name' in body).toBe(true);
        expect('nick_name' in body).toBe(true);
        expect('created_at' in body).toBe(true);
        expect('updated_at' in body).toBe(true);

        expect(typeof body.category_id).toBe('string');
        expect(typeof body.name).toBe('string');
        expect(typeof body.nick_name).toBe('string');
        expect(typeof body.created_at).toBe('string');
        expect(typeof body.updated_at).toBe('string');

        expect(body.name).toBe(testData.name);
        expect(body.nick_name).toBe(testData.nick_name);
        expect(body.product).toBe(testData.product);

        const header = response.header;

        expect(header['content-type']).toBe('application/json; charset=utf-8');
        expect(header['x-powered-by']).toBe('Express');
    });
});
