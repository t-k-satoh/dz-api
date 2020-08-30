import dotenv from 'dotenv';
import status from 'http-status';
import request from 'supertest';
import { mockApp } from '../../test-utils';
import { Result } from '../types';
import { PATH } from './constants';
import { list } from '.';

dotenv.config();

describe(__filename, () => {
    test('疎通確認', async () => {
        const response = await request(mockApp.use('/', list)).get(PATH);
        const body: Result = response.body;
        const header = response.header;

        expect(response.status).toBe(status.OK);

        expect('images' in body).toBe(true);
        expect('page' in body).toBe(true);

        console.log(body);

        expect(header['content-type']).toBe('application/json; charset=utf-8');
        expect(header['x-powered-by']).toBe('Express');
    });
});
