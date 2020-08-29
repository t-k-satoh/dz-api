import dotenv from 'dotenv';
import request from 'supertest';
import { mockApp } from '../../test-utils';
import { PATH } from './constants';
import { create, ReqBody } from '.';

dotenv.config();

describe(__filename, () => {
    test('疎通確認', async () => {
        const testData: ReqBody = {
            file_path: `${__dirname}/test/test.jpg`,
        };

        await request(mockApp.use('/', create)).post(PATH).send(testData);
    });
});
