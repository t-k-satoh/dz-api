import dotenv from 'dotenv';
import status from 'http-status';
import request from 'supertest';
import { PREFIX } from '../../constants';
import { mockApp } from '../../test-utils';
import { create } from '../create';
import { PATH as CREATE_PATH } from '../create/constants';
import { Result } from '../types';
import { _delete } from '.';

dotenv.config();

describe(__filename, () => {
    test('疎通確認', async () => {
        const testData = { name: 'test', nick_name: 'created for test' };
        const createResponse = await request(mockApp.use('/', create)).post(CREATE_PATH).send(testData);
        const body: Result['categories'][number] = createResponse.body;

        const response = await request(mockApp.use('/', _delete)).delete(`${PREFIX}/categories/${body.category_id}`);

        expect(response.status).toBe(status.NO_CONTENT);
    });
});
