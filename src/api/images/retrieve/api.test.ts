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
        const id = responseListBody.images[0].image_id;

        const response = await request(mockApp.use('/', retrieve)).get(`${PREFIX}/images/${id}`);

        expect(response.status).toBe(status.OK);

        const body: Result['images'][number] = response.body;

        expect('image_id' in body).toBe(true);
        expect('name' in body).toBe(true);
        expect('url' in body).toBe(true);
        expect('created_at' in body).toBe(true);
        expect('updated_at' in body).toBe(true);

        expect(typeof body.image_id).toBe('string');
        expect(typeof body.url).toBe('string');
        expect(typeof body.name).toBe('string');
        expect(typeof body.created_at).toBe('string');
        expect(typeof body.updated_at).toBe('string');

        const header = response.header;

        expect(header['content-type']).toBe('application/json; charset=utf-8');
        expect(header['x-powered-by']).toBe('Express');
    });
});
