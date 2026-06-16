import { User } from "./types";
import { AuthService } from "./services/auth.service";

export class ATMEngine {
    public users: Map<string, User> = new Map();
    public currentUser: User | null = null;

    public getOrCreateUser(name: string): User {
        let user = this.users.get(name);

        if (!user) {
            user = { name, balance: 0, debts: new Map() };
            this.users.set(name, user);
        }

        return user;
    }

    public login(name: string): string[] {
        return AuthService.login(this, name);
    }

    public logout(): string {
        return AuthService.logout(this);
    }
}