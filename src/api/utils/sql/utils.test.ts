import { generateString } from './index';

describe(__filename, () => {
    test('sqlReplace', () => {
        const data = {
            table: 'テーブル',
            column: 'カラム名',
            params: { test: 'test', test2: 1, test3: true },
            searchPrams: 'searchPrams',
        };

        const res = generateString.replace(data);

        expect(res).toBe(
            `UPDATE public.${data.table} SET test = 'test', test2 = 1, test3 = true WHERE ${data.column} = '${data.searchPrams}';`,
        );
    });
});
