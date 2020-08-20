import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import { strategy } from './strategy';

export const newPassport = passport;

newPassport.use(strategy);

newPassport.serializeUser((user: Auth0Strategy.Profile, done) => done(null, user));

newPassport.deserializeUser((user: Auth0Strategy.Profile, done) => done(null, user));
