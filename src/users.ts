import express from 'express';
import { secured } from './secured';
export const router = express.Router();

/* GET user profile. */
router.get('/user', secured(), function (req, res, _next) {
    const userProfile = req.user;
    res.send(JSON.stringify(userProfile, null, 2));
});
