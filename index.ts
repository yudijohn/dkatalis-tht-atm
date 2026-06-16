import * as readline from "readline";

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

    console.log("command: ", command);
    console.log("args: ", args);

    console.log("");
    rl.prompt();
}).on("close", () => {
    process.exit(0);
});