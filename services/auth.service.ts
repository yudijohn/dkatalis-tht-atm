import { ATMEngine } from "../atm";
import { UserService } from "./user.service";

export class AuthService {
    public static login(engine: ATMEngine, name: string): void {
        if (engine.currentUser) {
            console.warn(`You are already logged in as ${engine.currentUser.name}.`);
            return;
        }

        engine.currentUser = engine.getOrCreateUser(name);

        console.log(`Hello, ${engine.currentUser.name}!\n`);
        UserService.printBalance(engine.currentUser);
    }

    public static logout(engine: ATMEngine): void {
        if (!engine.currentUser) {
            console.error("No user logged in.");
            return;
        }

        const name = engine.currentUser.name;
        engine.currentUser = null;

        console.log(`Goodbye, ${name}!`);
    }
}