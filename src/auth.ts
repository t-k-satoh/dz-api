import querystring from 'querystring';
import url from 'url';
import util from 'util';
import dotenv from 'dotenv';
import express from 'express';

import passport from 'passport';

export const router = express.Router();

dotenv.config();

router.get(
    '/login',
    passport.authenticate('auth0', {
        scope: 'openid email profile',
    }),
    function (req, res) {
        res.redirect('/');
    },
);

router.get('/callback', function (req, res, next) {
    passport.authenticate('auth0', function (err, user, info) {
        console.log(err, user, info);
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send('ユーザーなし');
        }
        req.logIn(user, function (err) {
            if (err || typeof req.session === 'undefined') {
                return next(err);
            }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || '/user');
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();

    let returnTo = req.protocol + '://' + req.hostname;
    const port = req.connection.localPort;
    if (port !== undefined && port !== 80 && port !== 443) {
        returnTo += ':' + port;
    }

    const logoutURL = new url.URL(util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN));
    const searchString = querystring.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: returnTo,
    });
    logoutURL.search = searchString;

    res.redirect(String(logoutURL));
});
