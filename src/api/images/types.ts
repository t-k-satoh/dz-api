export type Image = {
    image_id: string;
    url: string;
    name: string;
    created_at: string;
    updated_at: string;
    product: boolean;
};

export type Result = {
    images: Image[];
    page: {
        total_count: number;
    };
};
