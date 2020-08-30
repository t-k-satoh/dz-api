export type KeyVisual = {
    key_visual_id: string;
    name: string;
    caption: string;
    image_id: string;
    url: string;
    created_at: string;
    updated_at: string;
    product: boolean;
};

export type Result = {
    key_visuals: Array<KeyVisual>;
    page: {
        total_count: number;
    };
};
