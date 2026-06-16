import { ATMEngine } from "../atm";

export class AuthService {
    public static login(engine: ATMEngine, name: string): string[] {
        if (engine.currentUser) {
            return [`You are already logged in as ${engine.currentUser.name}.`];
        }

        engine.currentUser = engine.getOrCreateUser(name);

        const output: string[] = [
            `Hello, ${engine.currentUser.name}!`,
            `Your balance is $${engine.currentUser.balance}`
        ];

        engine.currentUser.debts.forEach((amount: number, targetName: string) => {
            if (amount > 0) {
                output.push(`Owed $${amount} to ${targetName}`);
            } else if (amount < 0) {
                output.push(`Owed $${Math.abs(amount)} from ${targetName}`);
            }
        });

        return output;
    }

    public static logout(engine: ATMEngine): string {
        if (!engine.currentUser) return "Error: No user logged in.";

        const name = engine.currentUser.name;
        engine.currentUser = null;

        return `Goodbye, ${name}!`;
    }
}