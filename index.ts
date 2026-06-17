import * as readline from "readline";
import { ATMEngine } from "./atm";
import { atmStore } from "./store";
import { User } from "./types";

const atm = new ATMEngine();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "$ ",
});

/**
 * Middleware Guard
 * Ensures a user is logged in before executing an action
 * 
 * @param action The action to execute if the user is authenticated
 */
function requireAuth<T>(action: (user: User) => T): T | void {
    const user = atmStore.currentUser;

    if (!user) {
        console.error("You need to login first.");
        return;
    }

    return action(user);
}

rl.prompt();

rl.on("line", (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) {
        rl.prompt();
        return;
    }

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    console.log("");

    switch (command) {
        case "login": {
            if (!args[0]) {
                console.log("Usage: login [name]");
            } else {
                atm.login(args[0]);
            }
            break;
        }

        case "logout": {
            atm.logout();
            break;
        }

        case "deposit": {
            requireAuth((user) => {
                const amount = parseFloat(args[0]);
                if (isNaN(amount)) {
                    console.log("Usage: deposit [amount]");
                } else {
                    atm.deposit(user, amount);
                }
            });
            break;
        }

        case "withdraw": {
            requireAuth((user) => {
                const amount = parseFloat(args[0]);
                if (isNaN(amount)) {
                    console.log("Usage: withdraw [amount]");
                } else {
                    atm.withdraw(user, amount);
                }
            });
            break;
        }

        case "exit": {
            console.log("Thank you for using our atm service. Have a nice day!\n");
            rl.close();
            return;
        }

        default: {
            console.log(`Unknown command: ${command}`);
            break;
        }
    }

    console.log("");
    rl.prompt();
}).on("close", () => {
    process.exit(0);
}); 