export interface User {
    name: string;
    balance: number;
    debts: Map<string, number>;
}