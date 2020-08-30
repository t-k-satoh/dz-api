export type SubCategory = {
    sub_category_id: string;
    category_id: string;
    name: string;
    nick_name: string;
    created_at: string;
    updated_at: string;
    product: boolean;
};

export type Result = {
    sub_categories: Array<SubCategory>;
    page: {
        total_count: number;
    };
};
