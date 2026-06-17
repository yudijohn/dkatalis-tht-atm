import { User } from "./types";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";
import { TransactionService } from "./services/transaction.service";

export class ATMEngine {
    public users: User[] = [];
    public currentUser: User | null = null;

    public login(name: string): void {
        AuthService.login(this, name);
    }

    public logout(): void {
        AuthService.logout(this);
    }

    public deposit(amount: number): void {
        TransactionService.deposit(this, amount);
    }

    public withdraw(amount: number): void {
        TransactionService.withdraw(this, amount);
    }

    public getOrCreateUser(name: string): User {
        return UserService.getOrCreateUser(this, name);
    }
}