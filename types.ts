export interface User {
    user_key: string;
    name: string;
    balance: number;
}

export interface Transfer {
    user_key: string;
    target_user_key: string;
    amount: number;
    created_at: Date;
}

export interface Debt {
    user_key: string;
    target_user_key: string;
    amount: number;
    updated_at: Date;
}