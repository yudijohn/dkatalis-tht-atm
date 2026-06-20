import { atmStore } from "../store";
import { Debt, User } from "../types";
import { UserService } from "./user.service";

export class DebtService {
    public static addDebt(user: User, targetUser: User, amount: number): void {
        const hasDebt: boolean = atmStore.hasDebt(user.user_key, targetUser.user_key);

        if (hasDebt) {
            const debt: Debt = atmStore.getDebt(user.user_key, targetUser.user_key) as Debt;
            atmStore.updateDebt(user.user_key, targetUser.user_key, debt.amount + amount);
            UserService.updateBalance(targetUser, 'add', amount);
        } else {
            atmStore.createDebt({
                user_key: user.user_key,
                target_user_key: targetUser.user_key,
                amount: amount
            });
        }
    }

    public static reduceDebt(user: User, targetUser: User, amount: number): number {
        const hasDebt: boolean = atmStore.hasDebt(user.user_key, targetUser.user_key);
        let debtSettle = 0;

        if (hasDebt) {
            let debt: Debt = atmStore.getDebt(user.user_key, targetUser.user_key) as Debt;
            debtSettle = Math.min(amount, debt.amount);
            const newDebt = debt.amount - debtSettle;

            if (newDebt === 0) {
                atmStore.deleteDebt(user.user_key, targetUser.user_key);
            } else {
                atmStore.updateDebt(user.user_key, targetUser.user_key, newDebt);
            }
        }

        return debtSettle;
    }
}