import { User } from "./types";
import { AuthService } from "./services/auth.service";
import { TransactionService } from "./services/transaction.service";
import { atmStore } from "./store";

export class ATMEngine {
    /**
     * Middleware Guard
     * Ensures a user is logged in before executing an action
     * 
     * @param action The action to execute if the user is authenticated
     */
    public requireAuth<T>(action: (user: User) => T): T | void {
        const user = atmStore.currentUser;

        if (!user) {
            console.error("You need to login first.");
            return;
        }

        return action(user);
    }

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