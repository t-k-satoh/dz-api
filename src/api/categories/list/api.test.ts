import dotenv from 'dotenv';
import status from 'http-status';
import request from 'supertest';
import { app } from '../../../app/app';
import { mockApp } from '../../test-utils';
import { Result } from '../types';
import { PATH } from './constants';
import { list } from '.';

dotenv.config();

describe(__filename, () => {
    describe('authorized', () => {
        test('HTTP status code', async () => {
            const response = await request(mockApp.use('/', list)).get(PATH);

            expect(response.status).toBe(status.OK);
        });

        test('response payload', async () => {
            const response = await request(mockApp.use('/', list)).get(PATH);
            const body: Result = response.body;

            expect('categories' in body).toBe(true);
            expect('page' in body).toBe(true);
        });

        test('response headers', async () => {
            const response = await request(mockApp.use('/', list)).get(PATH);
            const header = response.header;

            expect(header['content-type']).toBe('application/json; charset=utf-8');
            expect(header['x-powered-by']).toBe('Express');
        });
    });
    describe('unauthorized', () => {
        test('HTTP status code', async () => {
            const response = await request(app.use('/', list)).get(PATH);

            expect(response.status).toBe(status.UNAUTHORIZED);
        });

        test('response payload', async () => {
            const response = await request(app.use('/', list)).get(PATH);
            const body: Result = response.body;
            const text = response.text;

            expect(body).toEqual({});
            expect(text).toBe(status[401]);
        });

        test('response headers', async () => {
            const response = await request(app.use('/', list)).get(PATH);
            const header = response.header;

            expect(header['content-type']).toBe('text/html; charset=utf-8');
            expect(header['x-powered-by']).toBe('Express');
        });
    });
});
