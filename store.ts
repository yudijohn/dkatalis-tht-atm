import { Debt, User } from "./types";

class ATMStore {
    private _users: Map<string, User> = new Map();
    private _currentUser: User | null = null;
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

    public createUser(userData: User): User {
        this._users.set(userData.user_key, userData);

        return userData;
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
            updated_at: new Date()
        });
    }
}

export const atmStore = new ATMStore();