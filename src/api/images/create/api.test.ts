import fs from 'fs';
import { format } from 'date-fns';
import dotenv from 'dotenv';
import request from 'supertest';
import { mockApp } from '../../test-utils';
import { PATH } from './constants';
import { create, ReqBody } from '.';

dotenv.config();

describe(__filename, () => {
    test('疎通確認', async () => {
        const txtFile = '/Users/Satoh/project/dz_api/__mock__/IMG_3205.JPG';

        console.log(new Blob());
    });
});
