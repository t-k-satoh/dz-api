"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var querystring_1 = __importDefault(require("querystring"));
var url_1 = __importDefault(require("url"));
var util_1 = __importDefault(require("util"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
exports.router = express_1.default.Router();
dotenv_1.default.config();
exports.router.get('/login', passport_1.default.authenticate('auth0', {
    scope: 'openid email profile',
}), function (req, res) {
    res.redirect('/');
});
exports.router.get('/callback', function (req, res, next) {
    passport_1.default.authenticate('auth0', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err || typeof req.session === 'undefined') {
                return next(err);
            }
            var returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || '/user');
        });
    })(req, res, next);
});
exports.router.get('/logout', function (req, res) {
    req.logout();
    var returnTo = req.protocol + '://' + req.hostname;
    var port = req.connection.localPort;
    if (port !== undefined && port !== 80 && port !== 443) {
        returnTo += ':' + port;
    }
    var logoutURL = new url_1.default.URL(util_1.default.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN));
    var searchString = querystring_1.default.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: returnTo,
    });
    logoutURL.search = searchString;
    res.redirect(String(logoutURL));
});
