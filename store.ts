import { Debt, Transaction, User } from "./types";

class ATMStore {
    private _users: Map<string, User> = new Map();
    private _currentUser: User | null = null;
    private _transactions: Transaction[] = [];
    private _debts: Debt[] = [];

    public get currentUser(): User | null {
        return this._currentUser;
    }

    public get debts(): Debt[] {
        return this._debts;
    }

    public setCurrentUser(user: User | null): void {
        this._currentUser = user;
    }

    public getUser(name: string): User | undefined {
        return this._users.get(name);
    }

    public createUser(name: string): User {
        const user = {
            user_key: name.toLowerCase(),
            name: name,
            balance: 0,
            created_at: new Date()
        };
        this._users.set(user.user_key, user);

        return user;
    }

    public createTransaction(transactionData: { user_key: string, target_user_key: string | null, type: 'deposit' | 'withdraw' | 'transfer', amount: number }): Transaction {
        this._transactions.push({
            ...transactionData,
            created_at: new Date()
        });

        return this._transactions[this._transactions.length - 1];
    }

    public hasDebt(user_key: string, target_user_key?: string, all: boolean = false): boolean {
        if (target_user_key) {
            return !!this._debts.find((debt) => debt.user_key === user_key && debt.target_user_key === target_user_key);
        }

        if (all) {
            return !!this._debts.find((debt) => (debt.user_key === user_key || debt.target_user_key === user_key));
        }

        return !!this._debts.find((debt) => debt.user_key === user_key);
    }

    public getDebt(user_key: string, target_user_key?: string, all: boolean = false): Debt | Debt[] | undefined {
        if (target_user_key) {
            return this._debts.find((debt) => debt.user_key === user_key && debt.target_user_key === target_user_key);
        }

        if (all) {
            return this._debts.filter((debt) => (debt.user_key === user_key || debt.target_user_key === user_key)).sort((a, b) => a.updated_at.getTime() - b.updated_at.getTime());
        }

        return this._debts.filter((debt) => debt.user_key === user_key).sort((a, b) => a.updated_at.getTime() - b.updated_at.getTime());
    }

    public createDebt(debtData: { user_key: string, target_user_key: string, amount: number }): void {
        this._debts.push({
            ...debtData,
            created_at: new Date(),
            updated_at: new Date()
        });
    }

    public updateDebt(user_key: string, target_user_key: string, amount: number): void {
        let debt: Debt = this.getDebt(user_key, target_user_key) as Debt;
        debt.amount = amount;
        debt.updated_at = new Date();
    }

    public deleteDebt(user_key: string, target_user_key: string): void {
        this._debts = this._debts.filter((debt) => debt.user_key !== user_key || debt.target_user_key !== target_user_key);
    }

    public reset(): void {
        this._users = new Map;
        this._currentUser = null;
        this._debts = [];
    }
}

export const atmStore = new ATMStore();