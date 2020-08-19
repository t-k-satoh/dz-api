"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var secured_1 = require("./secured");
exports.router = express_1.default.Router();
/* GET user profile. */
exports.router.get('/user', secured_1.secured(), function (req, res, _next) {
    var userProfile = req.user;
    console.log(req);
    res.send(JSON.stringify(userProfile, null, 2));
});
