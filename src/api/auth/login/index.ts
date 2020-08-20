import { newPassport } from '../../../app/passport';
import { router } from '../../../app/router';
import { STRATEGY } from '../constants';
import { PATH, SCOPE } from './constants';

export const loginRouter = router.get(
    PATH,
    newPassport.authenticate(STRATEGY, {
        scope: SCOPE,
    }),
    (_req, res) => res.redirect('/'),
);
