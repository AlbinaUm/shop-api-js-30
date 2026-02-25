export interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
    image: string | null;
}

export interface ProductWithoutId {
    title: string;
    price: number;
    description: string;
    image: string | null;
}