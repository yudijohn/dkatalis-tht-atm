import { atmStore } from "../store";
import { Debt, User } from "../types";

export class UserService {
    public static getOrCreateUser(name: string): User {
        const userKey = name.toLowerCase();

        let user = atmStore.getUser(userKey);

        if (!user) {
            user = atmStore.createUser({ user_key: userKey, name: name, balance: 0 });
        }

        return user;
    }

    public static updateBalance(user: User, type: 'add' | 'reduce', amount: number): void {
        if (type === 'add') user.balance += amount;
        else user.balance -= amount;
    }

    public static printBalance(user: User): string[] {
        return [`Your balance is $${user.balance}`];
    }

    public static printDebt(user: User, targetUser?: User): string[] {
        const output: string[] = [];
        const hasDebt: boolean = atmStore.hasDebt(user.user_key, targetUser ? targetUser.user_key : undefined, true);

        if (hasDebt) {
            if (targetUser) {
                const debt: Debt = atmStore.getDebt(user.user_key, targetUser.user_key) as Debt;
                output.push(`\nOwed $${debt.amount} to ${targetUser.name}`);
            } else {
                const debts: Debt[] = atmStore.getDebt(user.user_key, undefined, true) as Debt[];

                output.push("");
                debts.forEach((debt) => {
                    const owedTo: string = debt.user_key === user.user_key ? "to" : "from";
                    const owedUser: User = UserService.getOrCreateUser(debt.user_key === user.user_key ? debt.target_user_key : debt.user_key);

                    output.push(`Owed $${debt.amount} ${owedTo} ${owedUser.name}`);
                });
            }
        }

        return output;
    }
}