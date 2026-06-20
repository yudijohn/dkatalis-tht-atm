import { atmStore } from "../store";
import { UserService } from "./user.service";

export class AuthService {
    public static login(name: string): string[] {
        let user = atmStore.currentUser;

        if (user) {
            return [`You are already logged in as ${user.name}.`];
        }

        const output: string[] = [];

        user = UserService.getOrCreateUser(name);
        atmStore.setCurrentUser(user);

        output.push(`Hello, ${user.name}!\n`);
        output.push(...UserService.printBalance(user));
        output.push(...UserService.printDebt(user));

        return output;
    }

    public static logout(): string[] {
        const user = atmStore.currentUser;

        if (!user) {
            return ["No user logged in."];
        }

        const output: string[] = [];

        const name = user.name;
        atmStore.setCurrentUser(null);

        output.push(`Goodbye, ${name}!`);

        return output;
    }
}