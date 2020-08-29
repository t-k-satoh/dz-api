import AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

export const connectedAWS = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});

export const createPutObject = (key: string, body: AWS.S3.PutObjectRequest['Body']): AWS.S3.PutObjectRequest => ({
    Bucket: process.env.BUCKET_NAME ?? '',
    Key: key,
    Body: body,
});
