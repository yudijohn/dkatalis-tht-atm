import { atmStore } from "../store";
import { Debt, User } from "../types";
import { DebtService } from "./debt.service";
import { UserService } from "./user.service";

export class TransactionService {
    public static deposit(user: User, amount: number): void {
        let remainingAmount = amount;
        const debts: Debt[] = atmStore.getDebt(user.user_key) as Debt[];

        for (const debt of debts) {
            if (remainingAmount === 0) {
                break;
            }

            const targetUser: User = atmStore.getUser(debt.target_user_key)!;
            const debtSettled = DebtService.reduceDebt(user, targetUser, remainingAmount);

            if (debtSettled > 0) {
                UserService.updateBalance(targetUser, 'add', debtSettled);
                remainingAmount -= debtSettled;

                console.log(`Transferred $${debtSettled} to ${targetUser.name}\n`);
            }
        }

        if (remainingAmount > 0) {
            UserService.updateBalance(user, 'add', remainingAmount);
        }

        UserService.printBalance(user);
        UserService.printDebt(user);
    }

    public static withdraw(user: User, amount: number): void {
        UserService.updateBalance(user, 'reduce', amount);

        UserService.printBalance(user);
    }

    public static transfer(user: User, targetName: string, amount: number): void {
        const targetUser: User = UserService.getOrCreateUser(targetName);

        let remainingToTransfer = amount;

        // 1. Reduce debt to target User if exists
        const debtSettled = DebtService.reduceDebt(targetUser, user, amount);
        remainingToTransfer -= debtSettled;

        // 2. Transfer from actual cash balance
        if (remainingToTransfer > 0 && user.balance > 0) {
            const cashTransfer = Math.min(remainingToTransfer, user.balance);
            UserService.updateBalance(user, 'reduce', cashTransfer);
            UserService.updateBalance(targetUser, 'add', cashTransfer);
            remainingToTransfer -= cashTransfer;

            console.log(`Transferred $${cashTransfer} to ${targetUser.name}\n`);
        }

        // 3. Remaining amount will counted as debt
        if (remainingToTransfer > 0) {
            DebtService.addDebt(user, targetUser, remainingToTransfer);
        }

        UserService.printBalance(user);
        UserService.printDebt(user, targetUser);
        UserService.printDebt(targetUser, user);
    }
}