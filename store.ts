import { User } from "./types";

class ATMStore {
    private _users: Map<string, User> = new Map();
    private _currentUser: User | null = null;

    public get currentUser(): User | null {
        return this._currentUser;
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
}

export const atmStore = new ATMStore();