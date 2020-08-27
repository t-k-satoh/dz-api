import { format } from 'date-fns';
import dotenv from 'dotenv';
import status from 'http-status';
import request from 'supertest';
import { PREFIX } from '../../constants';
import { mockApp } from '../../test-utils';
import { create, ReqBody as CreateReqBody } from '../create';
import { PATH as CREATE_PATH } from '../create/constants';
import { Result } from '../types';
import { replace, ReqBody } from '.';

dotenv.config();

describe(__filename, () => {
    test('疎通確認', async () => {
        const testData: CreateReqBody = {
            name: `test created by ${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}`,
            nick_name: `created for ${process.env.CREATED}`,
            isProduct: false,
        };

        const createResponse = await request(mockApp.use('/', create)).post(CREATE_PATH).send(testData);
        const { category_id }: Result['categories'][number] = createResponse.body;

        const replaceData: ReqBody = {
            name: `test replace by ${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}`,
            nick_name: `replace for ${process.env.CREATED}`,
            isProduct: false,
        };

        const response = await request(mockApp.use('/', replace))
            .put(`${PREFIX}/categories/${category_id}`)
            .send(replaceData);

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

        expect(body.name).toBe(replaceData.name);
        expect(body.nick_name).toBe(replaceData.nick_name);
        expect(body.product).toBe(replaceData.isProduct);

        const header = response.header;

        expect(header['content-type']).toBe('application/json; charset=utf-8');
        expect(header['x-powered-by']).toBe('Express');
    });
});
