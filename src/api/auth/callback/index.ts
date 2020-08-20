import Auth0Strategy from 'passport-auth0';
import { newPassport } from '../../../app/passport';
import { router } from '../../../app/router';
import { PATH as USER_PATH } from '../../user/get/constants';
import { STRATEGY } from '../constants';
import { PATH as LOGIN_PATH } from '../login/constants';
import { PATH } from './constants';

export const callbackRouter = router.get(PATH, (req, res, next) => {
    newPassport.authenticate(STRATEGY, (err: Error, user: Auth0Strategy.Profile) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.redirect(LOGIN_PATH);
        }

        req.logIn(user, (logInError: Error) => {
            if (logInError || typeof req.session === 'undefined') {
                return next(logInError);
            }

            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || USER_PATH);
        });
    })(req, res, next);
});
