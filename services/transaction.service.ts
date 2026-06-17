import { ATMEngine } from "../atm";

export class TransactionService {
    public static deposit(engine: ATMEngine, amount: number): void {
        if (!engine.currentUser) {
            console.error("You need to login first.");
            return;
        }

        if (amount <= 0) {
            console.error("Amount must be greater than 0.");
            return;
        }

        engine.currentUser.balance += amount;

        console.log(`Your balance is $${engine.currentUser.balance}`);
    }

    public static withdraw(engine: ATMEngine, amount: number): void {
        if (!engine.currentUser) {
            console.error("You need to login first.");
            return;
        }

        if (amount <= 0) {
            console.error("Amount must be greater than 0.");
            return;
        }

        if (engine.currentUser.balance < amount) {
            console.error("Insufficient funds.");
            return;
        }

        engine.currentUser.balance -= amount;

        console.log(`Your balance is $${engine.currentUser.balance}`);
    }
}