export const list = ({ table }: { table: string }): string => `SELECT * FROM public.${table}`;

export const retrieve = ({
    table,
    column,
    searchPrams,
}: {
    table: string;
    column: string;
    searchPrams: string;
}): string => `SELECT * FROM public.${table} WHERE ${column} = '${searchPrams}'`;

export const create = ({
    table,
    params,
}: {
    table: string;
    params: { [key: string]: string | number | boolean | undefined };
}): string => {
    const keys = Object.keys(params).join(', ');
    const values = Object.values(params)
        .map((params) => (typeof params === 'undefined' ? null : params))
        .map((params) => `'${params}'`)
        .join(', ');

    return `INSERT INTO public.${table} (${keys}) VALUES (${values});`;
};

export const replace = ({
    table,
    column,
    params,
    searchPrams,
}: {
    table: string;
    column: string;
    params: { [key: string]: string | number | boolean | undefined };
    searchPrams: string;
}): string => {
    const properties = Object.entries(params)
        .filter((entry) => typeof entry[1] !== 'undefined')
        .map((entry) => {
            const key = entry[0];
            const value = entry[1];

            if (typeof value === 'string') {
                return `${key} = '${value}'`;
            }

            return `${key} = ${value}`;
        })
        .join(', ');

    return `UPDATE public.${table} SET ${properties} WHERE ${column} = '${searchPrams}';`;
};

export const _delete = ({
    table,
    column,
    searchPrams,
}: {
    table: string;
    column: string;
    searchPrams: string;
}): string => `DELETE FROM public.${table} WHERE ${column} IN ('${searchPrams}');`;
