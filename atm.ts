import { User } from "./types";
import { AuthService } from "./services/auth.service";
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

    public deposit(user: User, amount: number): void {
        TransactionService.deposit(user, amount);
    }

    public withdraw(user: User, amount: number): void {
        TransactionService.withdraw(user, amount);
    }
}