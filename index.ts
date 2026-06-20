import * as readline from "readline";
import { ATMEngine } from "./atm";

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
            if (!args[0]) {
                messages.push("Usage: login [name]");
            } else {
                messages.push(...atm.login(args[0]));
            }
            break;
        }

        case "logout": {
            messages.push(...atm.logout());
            break;
        }

        case "deposit": {
            atm.requireAuth((user) => {
                const amount = parseFloat(args[0]);
                if (isNaN(amount)) {
                    messages.push("Usage: deposit [amount]");
                } else {
                    messages.push(...atm.deposit(user, amount));
                }
            });
            break;
        }

        case "withdraw": {
            atm.requireAuth((user) => {
                const amount = parseFloat(args[0]);
                if (isNaN(amount)) {
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
                const amount = parseFloat(args[1]);
                if (!targetName || isNaN(amount)) {
                    messages.push("Usage: transfer [target] [amount]");
                } else {
                    messages.push(...atm.transfer(user, targetName, amount));
                }
            });
            break;
        }

        case "exit": {
            messages.push("Thank you for using our atm service. Have a nice day!\n");
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