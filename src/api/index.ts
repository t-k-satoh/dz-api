import { authRouters } from './auth';
import { userRouters } from './user';

export const routers = [...authRouters, ...userRouters];
