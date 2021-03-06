import dotenv from 'dotenv';
import status from 'http-status';
import request from 'supertest';
import { mockApp } from '../../test-utils';
import { PATH } from '../constants';
import { Result } from '../types';
import { list } from '.';

dotenv.config();

describe(__filename, () => {
    test('疎通確認', async () => {
        const response = await request(mockApp.use('/', list)).get(PATH);
        const body: Result = response.body;
        const header = response.header;

        expect(response.status).toBe(status.OK);

        expect('images_groups' in body).toBe(true);
        expect('page' in body).toBe(true);

        expect(header['content-type']).toBe('application/json; charset=utf-8');
        expect(header['x-powered-by']).toBe('Express');
    });
});
