import { User } from "./types";
import { AuthService } from "./services/auth.service";
import { TransactionService } from "./services/transaction.service";

export class ATMEngine {
    public login(name: string): void {
        AuthService.login(name);
    }

    public logout(): void {
        AuthService.logout();
    }

    public deposit(user: User, amount: number): void {
        TransactionService.deposit(user, amount);
    }

    public withdraw(user: User, amount: number): void {
        TransactionService.withdraw(user, amount);
    }
}