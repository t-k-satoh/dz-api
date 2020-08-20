import dotenv from 'dotenv';
import Auth0Strategy from 'passport-auth0';
import { REDIRECT_URI } from '../constants';

dotenv.config();

export const strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN ?? '',
        clientID: process.env.AUTH0_CLIENT_ID ?? '',
        clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
        callbackURL: process.env.REDIRECT_URI ?? REDIRECT_URI,
    },
    (_accessToken, _refreshToken, _extraParams, profile, done) => done(null, profile),
);
