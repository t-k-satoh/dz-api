import * as dotenv from 'dotenv';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

dotenv.config();

export const checkJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: process.env.ISSUER,
    algorithms: ['RS256'],
});
