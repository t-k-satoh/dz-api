import express from 'express';
import { secured } from './secured';
export const router = express.Router();

/* GET user profile. */
router.get('/user', secured(), function (req, res, _next) {
    const userProfile = req.user;

    console.log(req);
    res.send(JSON.stringify(userProfile, null, 2));
});
