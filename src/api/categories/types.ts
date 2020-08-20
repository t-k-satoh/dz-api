export type Category = {
    category_id: string;
    name: string;
    nick_name: string;
    created_at: string;
    updated_at: string;
};

export type Result = {
    categories: Array<Category>;
    page: {
        total_count: number;
    };
};
