import path from 'path';
import bodyParser from 'body-parser';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import logger from 'morgan';
import { newPassport } from './passport';

dotenv.config();

export const app = express();

app.use(logger('dev'));
app.use(cookieParser());

// Enable All CORS Requests
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const options: Omit<session.SessionOptions, 'cookie'> = {
    secret: process.env.SESSION_SECRET ?? '',
    resave: false,
    saveUninitialized: true,
};

const isProduct = app.get('env') === 'production' || process.env.NODE_ENV === 'production';

if (isProduct) {
    app.set('trust proxy', 1);

    app.use(
        session({
            ...options,
            cookie: {
                secure: true,
            },
        }),
    );
} else {
    app.use(
        session({
            ...options,
            cookie: {
                secure: false,
            },
        }),
    );
}

app.use(newPassport.initialize());
app.use(newPassport.session());
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

app.use('/doc', express.static('public'));
