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
        if (amount <= 0) {
            console.error("Amount must be greater than 0.");
            return;
        }

        TransactionService.deposit(user, amount);
    }

    public withdraw(user: User, amount: number): void {
        if (amount <= 0) {
            console.error("Amount must be greater than 0.");
            return;
        }

        if (user.balance < amount) {
            console.error("Insufficient funds.");
            return;
        }

        TransactionService.withdraw(user, amount);
    }

    public transfer(user: User, targetName: string, amount: number): void {
        if (amount <= 0) {
            console.error("Amount must be greater than 0.");
            return;
        }

        if (targetName === user.name) {
            console.error("Cannot transfer to yourself.");
            return;
        }

        TransactionService.transfer(user, targetName, amount);
    }
}