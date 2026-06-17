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

    public static transfer(user: User, targetName: string, amount: number): void {
        if (amount <= 0) {
            console.error("Amount must be greater than 0.");
            return;
        }

        if (targetName === user.name) {
            console.error("Cannot transfer to yourself.");
            return;
        }

        const targetUser: User = UserService.getOrCreateUser(targetName);

        user.balance -= amount;
        targetUser.balance += amount;

        console.log(`Transferred $${amount} to ${targetUser.name}\n`);
        UserService.printBalance(user);
    }
}