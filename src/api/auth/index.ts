import { callbackRouter } from './callback';
import { loginRouter } from './login';
import { logoutRouter } from './logout';

export const authRouters = [callbackRouter, loginRouter, logoutRouter];
