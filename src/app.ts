import path from 'path';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import logger from 'morgan';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import { router as authRouter } from './auth';
import { router as usersRouter } from './users';

dotenv.config();

const strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN ?? '',
        clientID: process.env.AUTH0_CLIENT_ID ?? '',
        clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
        callbackURL: process.env.REDIRECT_URI ?? 'http://localhost:3000/callback',
    },
    (_accessToken, _refreshToken, _extraParams, profile, done) => done(null, profile),
);

passport.use(strategy);

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

export const app = express();

app.use(logger('dev'));
app.use(cookieParser());

const config = {
    secret: 'CHANGE THIS SECRET',
    cookie: {
        secure: false,
    },
    resave: false,
    saveUninitialized: true,
};

if (app.get('env') === 'production' || process.env.NODE_ENV === 'production') {
    console.log('本番環境');
    app.set('trust proxy', 1);
    config.cookie.secure = true;
}

app.use(session(config));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use((req, _res, next) => {
    const hasError = req && req.query && req.query.error;
    const hasErrorWithDescription = req && req.query && req.query.error_description;

    if (hasError) {
        req.flash('error', String(req.query.error));
    }
    if (hasErrorWithDescription) {
        req.flash('error_description', String(req.query.error_description));
    }
    next();
});

app.use('/', authRouter);
app.use('/', usersRouter);
app.use('/', (req, res) => {
    const userProfile = req.user;

    res.send(JSON.stringify(userProfile));
});

app.use((_req, _res, next) => {
    const err = new Error('Not Found');

    next({
        ...err,
        status: 404,
    });
});
