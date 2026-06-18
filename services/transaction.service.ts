import { User } from "../types";
import { DebtService } from "./debt.service";
import { UserService } from "./user.service";

export class TransactionService {
    public static deposit(user: User, amount: number): void {
        user.balance += amount;

        UserService.printBalance(user);
    }

    public static withdraw(user: User, amount: number): void {
        user.balance -= amount;

        UserService.printBalance(user);
    }

    public static transfer(user: User, targetName: string, amount: number): void {
        const targetUser: User = UserService.getOrCreateUser(targetName);

        let remainingToTransfer = amount;

        // 1. Reduce debt to target User if exists
        // 

        // 2. Transfer from actual cash balance
        if (remainingToTransfer > 0 && user.balance > 0) {
            const cashTransfer = Math.min(remainingToTransfer, user.balance);
            user.balance -= cashTransfer;
            targetUser.balance += cashTransfer;
            remainingToTransfer -= cashTransfer;
        }

        // 3. Remaining amount will counted as debt
        if (remainingToTransfer > 0) {
            DebtService.addDebt(user, targetUser, remainingToTransfer);
        }

        console.log(`Transferred $${amount} to ${targetUser.name}\n`);
        UserService.printBalance(user);
        UserService.printDebt(user, targetUser);
    }
}