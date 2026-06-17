import { ATMEngine } from "../atm";
import { User } from "../types";

export class UserService {
    public static getOrCreateUser(engine: ATMEngine, name: string): User {
        const userKey = name.toLowerCase();

        let user = engine.users.find((user) => user.user_key === userKey);

        if (!user) {
            user = { user_key: userKey, name: name, balance: 0, debts: new Map() };
            engine.users.push(user);
        }

        return user;
    }
}