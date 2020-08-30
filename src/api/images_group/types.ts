export type ImagesGroup = {
    image_group_id: string;
    name: string;
    description: string;
    image_id_1: string;
    image_id_2: string;
    image_id_3: string;
    created_at: string;
    updated_at: string;
    product: boolean;
};

export type Result = {
    image_groups: Array<ImagesGroup>;
    page: {
        total_count: number;
    };
};
