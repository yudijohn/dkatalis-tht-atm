export interface User {
    user_key: string;
    name: string;
    balance: number;
    created_at: Date;
}

export interface Transaction {
    user_key: string;
    target_user_key: string | null;
    type: 'deposit' | 'withdraw' | 'transfer';
    amount: number;
    created_at: Date;
}

export interface Debt {
    user_key: string;
    target_user_key: string;
    amount: number;
    created_at: Date;
    updated_at: Date;
}