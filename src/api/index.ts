import { authRouters } from './auth';
import { categoriesRouters } from './categories';
import { userRouters } from './user';

export const routers = [...authRouters, ...userRouters, ...categoriesRouters];
