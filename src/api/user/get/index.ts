import { router } from '../../../app/router';
import { checkJwt } from '../../utils';
import { PATH } from './constants';

export const getUser = router.get(PATH, checkJwt, (req, res) => {
    const userProfile = req.user;

    res.send(JSON.stringify(userProfile, null, 2));
});
