import { router } from '../../../app/router';
import { secured } from '../../utils';
import { PATH } from './constants';

export const getUser = router.get(PATH, secured, (req, res) => {
    const userProfile = req.user;

    res.send(JSON.stringify(userProfile, null, 2));
});
