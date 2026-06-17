import { User } from "../types";
import { UserService } from "./user.service";

export class TransactionService {
    public static deposit(user: User, amount: number): void {
        if (amount <= 0) {
            console.error("Amount must be greater than 0.");
            return;
        }

        user.balance += amount;

        UserService.printBalance(user);
    }

    public static withdraw(user: User, amount: number): void {
        if (amount <= 0) {
            console.error("Amount must be greater than 0.");
            return;
        }

        if (user.balance < amount) {
            console.error("Insufficient funds.");
            return;
        }

        user.balance -= amount;

        UserService.printBalance(user);
    }
}