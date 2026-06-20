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
            throw new Error("You need to login first.");
        }

        return action(user);
    }

    public login(name: string): string[] {
        return AuthService.login(name);
    }

    public logout(): string[] {
        return AuthService.logout();
    }

    public deposit(user: User, amount: number): string[] {
        if (amount <= 0) {
            return ["Amount must be greater than 0."];
        }

        return TransactionService.deposit(user, amount);
    }

    public withdraw(user: User, amount: number): string[] {
        if (amount <= 0) {
            return ["Amount must be greater than 0."];
        }

        return TransactionService.withdraw(user, amount);
    }

    public transfer(user: User, targetName: string, amount: number): string[] {
        if (amount <= 0) {
            return ["Amount must be greater than 0."];
        }

        if (targetName === user.name) {
            return ["Cannot transfer to yourself."];
        }

        return TransactionService.transfer(user, targetName, amount);
    }
}