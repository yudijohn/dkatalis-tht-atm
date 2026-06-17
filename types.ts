export interface User {
    user_key: string;
    name: string;
    balance: number;
}

export interface DebtRecord {
    user_key: string;
    target_user_key: string;
    amount: number;
}