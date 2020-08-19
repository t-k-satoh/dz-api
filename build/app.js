"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var path_1 = __importDefault(require("path"));
var connect_flash_1 = __importDefault(require("connect-flash"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var express_session_1 = __importDefault(require("express-session"));
var morgan_1 = __importDefault(require("morgan"));
var passport_1 = __importDefault(require("passport"));
var passport_auth0_1 = __importDefault(require("passport-auth0"));
var auth_1 = require("./auth");
var users_1 = require("./users");
dotenv_1.default.config();
var strategy = new passport_auth0_1.default({
    domain: (_a = process.env.AUTH0_DOMAIN) !== null && _a !== void 0 ? _a : '',
    clientID: (_b = process.env.AUTH0_CLIENT_ID) !== null && _b !== void 0 ? _b : '',
    clientSecret: (_c = process.env.AUTH0_CLIENT_SECRET) !== null && _c !== void 0 ? _c : '',
    callbackURL: (_d = process.env.REDIRECT_URI) !== null && _d !== void 0 ? _d : 'http://localhost:3000/callback',
}, function (_accessToken, _refreshToken, _extraParams, profile, done) { return done(null, profile); });
passport_1.default.use(strategy);
passport_1.default.serializeUser(function (user, done) { return done(null, user); });
passport_1.default.deserializeUser(function (user, done) { return done(null, user); });
exports.app = express_1.default();
exports.app.use(morgan_1.default('dev'));
exports.app.use(cookie_parser_1.default());
var config = {
    secret: 'CHANGE THIS SECRET',
    cookie: {
        secure: false,
    },
    resave: false,
    saveUninitialized: true,
};
if (exports.app.get('env') === 'production') {
    config.cookie.secure = true;
}
exports.app.use(express_session_1.default(config));
exports.app.use(passport_1.default.initialize());
exports.app.use(passport_1.default.session());
exports.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
exports.app.use(connect_flash_1.default());
exports.app.use(function (req, _res, next) {
    var hasError = req && req.query && req.query.error;
    var hasErrorWithDescription = req && req.query && req.query.error_description;
    if (hasError) {
        req.flash('error', String(req.query.error));
    }
    if (hasErrorWithDescription) {
        req.flash('error_description', String(req.query.error_description));
    }
    next();
});
exports.app.use('/', auth_1.router);
exports.app.use('/', users_1.router);
exports.app.use('/', function (req, res, _next) {
    var userProfile = req.user;
    res.send(JSON.stringify(userProfile));
});
exports.app.use(function (_req, _res, next) {
    var err = new Error('Not Found');
    next(__assign(__assign({}, err), { status: 404 }));
});
