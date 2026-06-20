import { atmStore } from "../store";
import { Debt, User } from "../types";
import { DebtService } from "./debt.service";
import { UserService } from "./user.service";

export class TransactionService {
    public static deposit(user: User, amount: number): string[] {
        let remainingAmount = amount;
        const debts: Debt[] = atmStore.getDebt(user.user_key) as Debt[];
        const output: string[] = [];

        atmStore.createTransaction({
            user_key: user.user_key,
            target_user_key: null,
            type: 'deposit',
            amount: amount
        });

        for (const debt of debts) {
            if (remainingAmount === 0) {
                break;
            }

            const targetUser: User = atmStore.getUser(debt.target_user_key)!;
            const debtSettled = DebtService.reduceDebt(user, targetUser, remainingAmount);

            if (debtSettled > 0) {
                UserService.updateBalance(targetUser, 'add', debtSettled);
                remainingAmount -= debtSettled;

                output.push(`Transferred $${debtSettled} to ${targetUser.name}\n`);
            }
        }

        if (remainingAmount > 0) {
            UserService.updateBalance(user, 'add', remainingAmount);
        }

        output.push(...UserService.printBalance(user));
        output.push(...UserService.printDebt(user));

        return output;
    }

    public static withdraw(user: User, amount: number): string[] {
        if (user.balance < amount) {
            return ["Insufficient funds."];
        }

        const output: string[] = [];

        atmStore.createTransaction({
            user_key: user.user_key,
            target_user_key: null,
            type: 'withdraw',
            amount: amount
        });

        UserService.updateBalance(user, 'reduce', amount);

        output.push(...UserService.printBalance(user));

        return output;
    }

    public static transfer(user: User, targetName: string, amount: number): string[] {
        const targetUser: User = UserService.getOrCreateUser(targetName);
        const output: string[] = [];

        let remainingToTransfer = amount;

        atmStore.createTransaction({
            user_key: user.user_key,
            target_user_key: targetUser.user_key,
            type: 'transfer',
            amount: amount
        });

        // 1. Reduce debt to target User if exists
        const debtSettled = DebtService.reduceDebt(targetUser, user, amount);
        remainingToTransfer -= debtSettled;

        // 2. Transfer from actual cash balance
        if (remainingToTransfer > 0 && user.balance > 0) {
            const cashTransfer = Math.min(remainingToTransfer, user.balance);
            UserService.updateBalance(user, 'reduce', cashTransfer);
            UserService.updateBalance(targetUser, 'add', cashTransfer);
            remainingToTransfer -= cashTransfer;

            output.push(`Transferred $${cashTransfer} to ${targetUser.name}\n`);
        }

        // 3. Remaining amount will counted as debt
        if (remainingToTransfer > 0) {
            DebtService.addDebt(user, targetUser, remainingToTransfer);
        }

        output.push(...UserService.printBalance(user));
        output.push(...UserService.printDebt(user));

        return output;
    }
}