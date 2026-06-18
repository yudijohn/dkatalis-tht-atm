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

    public static printBalance(user: User): void {
        console.log(`Your balance is $${user.balance}`);
    }

    public static printDebt(user: User, targetUser?: User): void {
        const hasDebt: boolean = atmStore.hasDebt(user.user_key, targetUser ? targetUser.user_key : undefined);

        if (hasDebt) {
            if (targetUser) {
                const debt: Debt = atmStore.getDebt(user.user_key, targetUser.user_key) as Debt;
                console.log(`\nOwed $${debt.amount} to ${targetUser.name}`);
            } else {
                const debts: Debt[] = atmStore.getDebt(user.user_key) as Debt[];

                console.log("");
                debts.forEach((debt) => {
                    const owedTo: string = debt.user_key === user.user_key ? "to" : "from";
                    const owedUser: User = UserService.getOrCreateUser(debt.user_key === user.user_key ? debt.target_user_key : debt.user_key);

                    console.log(`Owed $${debt.amount} ${owedTo} ${owedUser.name}`);
                });
            }
        }
    }
}