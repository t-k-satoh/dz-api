"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secured = void 0;
var secured = function () {
    return function secured(req, res, next) {
        if (req.user) {
            return next();
        }
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    };
};
exports.secured = secured;
