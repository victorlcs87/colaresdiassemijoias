export interface ProductSizes {
    label: string;
    options: string[];
}

export interface Product {
    id: string;
    created_at: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    image_gallery?: string[];
    is_available: boolean;
    sizes?: ProductSizes | null;
    category?: string | null;
    stock_quantity?: number;
    color?: string | null;
    cost_price?: number | null;
    promotional_price?: number | null;
    condition?: 'novo' | 'seminovo';
}

export type FeedbackStatus = "pending" | "approved" | "rejected";

export interface Feedback {
    id: string;
    created_at: string;
    updated_at: string;
    customer_name: string;
    comment: string;
    rating: number;
    status: FeedbackStatus;
    moderated_at?: string | null;
    moderated_by?: string | null;
}
