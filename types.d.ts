export interface Product {
    id: string;
    category: {
        title: string
    };
    title: string;
    price: number;
    description: string;
    image: string | null;
    created_at: string;
}

export interface ProductWithoutId {
    title: string;
    category_id: number;
    price: number;
    description: string;
    image: string | null;
}

export interface Category {
    id: number;
    title: string;
    description: string;
}