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
    user: string;
    title: string;
    price: number;
    description: string;
    images: string[] | null;
}

export interface Category {
    id: number;
    title: string;
    description: string;
}

export interface UserFields {
    username: string;
    password: string;
    token: string;
    role: string;
    __confirmPassword: string;
}
