import dotenv from 'dotenv';
import status from 'http-status';
import request from 'supertest';
import { PREFIX } from '../../constants';
import { mockApp } from '../../test-utils';
import { list } from '../list';
import { PATH as LIST_PATH } from '../list/constants';
import { Result } from '../types';
import { retrieve } from '.';

dotenv.config();

describe(__filename, () => {
    test('疎通確認', async () => {
        const responseList = await request(mockApp.use('/', list)).get(LIST_PATH);
        const responseListBody: Result = responseList.body;
        const id = responseListBody.categories[0].category_id;

        const response = await request(mockApp.use('/', retrieve)).get(`${PREFIX}/categories/${id}`);

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

        const header = response.header;

        expect(header['content-type']).toBe('application/json; charset=utf-8');
        expect(header['x-powered-by']).toBe('Express');
    });
});
