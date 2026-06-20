import * as readline from "readline";
import { ATMEngine } from "./atm";

/**
 * Parses a string value as a float and validates it.
 * Returns null if the value is NaN, infinite, or has more than 2 decimal places.
 */
function parseAmount(value: string): number | null {
    const amount = parseFloat(value);
    if (isNaN(amount) || !isFinite(amount)) {
        return null;
    }
    // Verify that there are at most 2 decimal places
    if (Math.abs(Math.round(amount * 100) - (amount * 100)) > 1e-9) {
        return null;
    }
    return amount;
}

const atm = new ATMEngine();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "$ ",
});

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

    const messages: string[] = [""];

    switch (command) {
        case "login": {
            if (!args[0] || args.length > 1) {
                messages.push("Usage: login [name]");
            } else {
                messages.push(...atm.login(args[0]));
            }
            break;
        }

        case "logout": {
            if (args.length > 0) {
                messages.push("Usage: logout");
            } else {
                messages.push(...atm.logout());
            }
            break;
        }

        case "deposit": {
            atm.requireAuth((user) => {
                const amount = parseAmount(args[0]);
                if (amount === null || args.length > 1) {
                    messages.push("Usage: deposit [amount]");
                } else {
                    messages.push(...atm.deposit(user, amount));
                }
            });
            break;
        }

        case "withdraw": {
            atm.requireAuth((user) => {
                const amount = parseAmount(args[0]);
                if (amount === null || args.length > 1) {
                    console.log("Usage: withdraw [amount]");
                } else {
                    atm.withdraw(user, amount);
                }
            });
            break;
        }

        case "transfer": {
            atm.requireAuth((user) => {
                const targetName = args[0];
                const amount = parseAmount(args[1]);
                if (!targetName || amount === null || args.length > 2) {
                    messages.push("Usage: transfer [target] [amount]");
                } else {
                    messages.push(...atm.transfer(user, targetName, amount));
                }
            });
            break;
        }

        case "exit": {
            if (args.length > 0) {
                messages.push("Usage: exit");
            } else {
                messages.push("Thank you for using our atm service. Have a nice day!\n");
            }
            console.log(messages.join("\n"));
            rl.close();
            return;
        }

        default: {
            messages.push(`Unknown command: ${command}`);
            break;
        }
    }

    messages.push("");
    console.log(messages.join("\n"));

    rl.prompt();
}).on("close", () => {
    process.exit(0);
}); 