import { create } from './create';
import { _delete } from './delete';
import { list } from './list';
import { replace } from './replace';
import { retrieve } from './retrieve';

export const categoriesRouters = [list, retrieve, create, _delete, replace];
