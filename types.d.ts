export interface Product {
    id: string;
    category: Category;
    title: string;
    price: number;
    description: string;
    image: string | null;
    created_at: string;
}

export interface ProductWithoutId {
    category: string;
    title: string;
    price: number;
    description: string;
    image: string | null;
}

export interface Category {
    id: number;
    title: string;
    description: string;
}