export type Product = {
    product_id: string;
    category_id: string;
    sub_category_id: string;
    suzuri_id: string;
    name: string;
    nick_name: string;
    description: string;
    release_date: string;
    created_at: string;
    updated_at: string;
    product: boolean;
    images_group_id: string;
    recommend: boolean;
    new: boolean;
};

export type Result = {
    products: Array<Product>;
    page: {
        total_count: number;
    };
};
