import { atmStore } from "../store";
import { UserService } from "./user.service";

export class AuthService {
    public static login(name: string): void {
        let user = atmStore.currentUser;

        if (user) {
            console.warn(`You are already logged in as ${user.name}.`);
            return;
        }

        user = UserService.getOrCreateUser(name);
        atmStore.setCurrentUser(user);

        console.log(`Hello, ${user.name}!\n`);
        UserService.printBalance(user);
        UserService.printDebt(user);
    }

    public static logout(): void {
        const user = atmStore.currentUser;

        if (!user) {
            console.error("No user logged in.");
            return;
        }

        const name = user.name;
        atmStore.setCurrentUser(null);

        console.log(`Goodbye, ${name}!`);
    }
}