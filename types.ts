export interface User {
    user_key: string;
    name: string;
    balance: number;
    debts: Map<string, number>;
}