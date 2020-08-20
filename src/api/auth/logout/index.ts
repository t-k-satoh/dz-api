import querystring from 'querystring';
import url from 'url';
import util from 'util';
import dotenv from 'dotenv';
import { router } from '../../../app/router';
import { PATH } from './constants';

dotenv.config();

export const logoutRouter = router.get(PATH, (req, res) => {
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
