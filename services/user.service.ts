import { atmStore } from "../store";
import { User } from "../types";

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
}