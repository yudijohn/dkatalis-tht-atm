import { atmStore } from "../store";
import { Debt, User } from "../types";

export class DebtService {
    public static addDebt(user: User, targetUser: User, amount: number): void {
        const hasDebt: boolean = atmStore.hasDebt(user.user_key, targetUser.user_key);

        if (hasDebt) {
            const debt: Debt = atmStore.getDebt(user.user_key, targetUser.user_key) as Debt;
            debt.amount = debt.amount + amount;
            debt.updated_at = new Date();
        } else {
            atmStore.createDebt({
                user_key: user.user_key,
                target_user_key: targetUser.user_key,
                amount: amount
            });
        }
    }
}