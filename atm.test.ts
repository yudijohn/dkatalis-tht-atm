import { describe, it, expect, beforeEach } from "vitest";
import { ATMEngine } from "./atm";
import { atmStore } from "./store";
import { UserService } from "./services/user.service";

describe("ATMEngine Functional Tests", () => {
    let atm: ATMEngine;

    beforeEach(() => {
        atm = new ATMEngine();
    });

    describe("Auth Service", () => {
        it("Login User", () => {
            const output = atm.login("Alice").join("");

            expect(output).toContain("Hello, Alice!");
            expect(output).toContain("Your balance is $0");
        });

        it("Login when user is already logged in", () => {
            const output = atm.login("Alice").join("");

            expect(output).toContain("You are already logged in as Alice.");
        });

        it("Logout User", () => {
            const output = atm.logout().join("");

            expect(output).toContain("Goodbye, Alice!");
        });

        it("Logout when no user is logged in", () => {
            const output = atm.logout().join("");

            expect(output).toContain("No user logged in.");
        });
    });

    describe("Middleware Guard", () => {
        const userAlice = UserService.getOrCreateUser("Alice");
        const userBob = UserService.getOrCreateUser("Bob");

        it("Disallow deposit without login", () => {
            expect(() => {
                atm.requireAuth(() => atm.deposit(userAlice, 100));
            }).toThrow("You need to login first.");
        });

        it("Disallow withdrawal without login", () => {
            expect(() => {
                atm.requireAuth(() => atm.withdraw(userAlice, 100));
            }).toThrow("You need to login first.");
        });

        it("Disallow transfer without login", () => {
            expect(() => {
                atm.requireAuth(() => atm.transfer(userAlice, userBob.name, 100));
            }).toThrow("You need to login first.");
        });
    });

    describe("Deposit Service", () => {
        const userAlice = UserService.getOrCreateUser("Alice");

        it("Deposit positive amount", () => {
            const output = atm.deposit(userAlice, 100);

            expect(output).toContain("Your balance is $100");
            expect(userAlice.balance).toBe(100);
        });

        it("Deposit zero amount", () => {
            const output = atm.deposit(userAlice, 0);

            expect(output).toContain("Amount must be greater than 0.");
            expect(userAlice.balance).toBe(100);
        });

        it("Deposit negative amount -$100", () => {
            const output = atm.deposit(userAlice, -100);

            expect(output).toContain("Amount must be greater than 0.");
            expect(userAlice.balance).toBe(100);
        });
    });

    describe("Withdrawal Service", () => {
        const userAlice = UserService.getOrCreateUser("Alice");

        it("Withdraw positive amount $40", () => {
            const output = atm.withdraw(userAlice, 40).join("");

            expect(output).toContain("Your balance is $60");
            expect(userAlice.balance).toBe(60);
        });

        it("Withdraw zero amount", () => {
            const output = atm.withdraw(userAlice, 0);

            expect(output).toContain("Amount must be greater than 0.");
            expect(userAlice.balance).toBe(60);
        });

        it("Withdraw negative amount -$100", () => {
            const output = atm.withdraw(userAlice, -100);

            expect(output).toContain("Amount must be greater than 0.");
            expect(userAlice.balance).toBe(60);
        });

        it("Withdraw overdrawing $100, user has $60", () => {
            const output = atm.withdraw(userAlice, 100);

            expect(output).toContain("Insufficient funds.");
            expect(userAlice.balance).toBe(60);
        });
    });
});

describe("Test Case", () => {
    atmStore.reset();
    let atm: ATMEngine;

    beforeEach(() => {
        atm = new ATMEngine();
    });

    describe("Test Case 01", () => {
        const userAlice = UserService.getOrCreateUser("Alice");
        const userBob = UserService.getOrCreateUser("Bob");

        it("Login as Alice and deposit $100", () => {
            let output = atm.login("Alice").join("");

            expect(output).toContain("Hello, Alice!");
            expect(output).toContain("Your balance is $0");
            expect(userAlice.balance).toBe(0);

            output = atm.deposit(userAlice, 100).join("");

            expect(output).toContain("Your balance is $100");
            expect(userAlice.balance).toBe(100);
        });

        it("Logout Alice", () => {
            const output = atm.logout().join("");

            expect(output).toContain("Goodbye, Alice!");
        });

        it("Login as Bob and deposit $80", () => {
            let output = atm.login("Bob").join("");

            expect(output).toContain("Hello, Bob!");
            expect(output).toContain("Your balance is $0");
            expect(userBob.balance).toBe(0);

            output = atm.deposit(userBob, 80).join("");

            expect(output).toContain("Your balance is $80");
            expect(userBob.balance).toBe(80);
        });

        it("Transfer to Alice $50", () => {
            let output = atm.transfer(userBob, "Alice", 50).join("");

            expect(output).toContain("Transferred $50 to Alice");
            expect(output).toContain("Your balance is $30");
            expect(userBob.balance).toBe(30);
            expect(userAlice.balance).toBe(150);
        });

        it("Transfer to Alice $100", () => {
            let output = atm.transfer(userBob, "Alice", 100).join("");

            expect(output).toContain("Transferred $30 to Alice");
            expect(output).toContain("Your balance is $0");
            expect(output).toContain("Owed $70 to Alice");
            expect(userBob.balance).toBe(0);
            expect(userAlice.balance).toBe(180);
        });

        it("Deposit $30", () => {
            let output = atm.deposit(userBob, 30).join("");

            expect(output).toContain("Transferred $30 to Alice");
            expect(output).toContain("Your balance is $0");
            expect(output).toContain("Owed $40 to Alice");
            expect(userBob.balance).toBe(0);
            expect(userAlice.balance).toBe(210);
        });

        it("Logout Bob", () => {
            const output = atm.logout().join("");

            expect(output).toContain("Goodbye, Bob!");
        });

        it("Login as Alice", () => {
            const output = atm.login("Alice").join("");

            expect(output).toContain("Hello, Alice!");
            expect(output).toContain("Your balance is $210");
            expect(output).toContain("Owed $40 from Bob");
            expect(userAlice.balance).toBe(210);
        });

        it("Transfer to Bob $30", () => {
            let output = atm.transfer(userAlice, "Bob", 30).join("");

            expect(output).toContain("Your balance is $210");
            expect(output).toContain("Owed $10 from Bob");
            expect(userBob.balance).toBe(0);
            expect(userAlice.balance).toBe(210);
        });

        it("Logout Alice", () => {
            const output = atm.logout().join("");

            expect(output).toContain("Goodbye, Alice!");
        });

        it("Login as Bob", () => {
            const output = atm.login("Bob").join("");

            expect(output).toContain("Hello, Bob!");
            expect(output).toContain("Your balance is $0");
            expect(output).toContain("Owed $10 to Alice");
            expect(userBob.balance).toBe(0);
        });

        it("Deposit $100", () => {
            let output = atm.deposit(userBob, 100).join("");

            expect(output).toContain("Transferred $10 to Alice");
            expect(output).toContain("Your balance is $90");
            expect(userBob.balance).toBe(90);
            expect(userAlice.balance).toBe(220);
        });

        it("Logout Bob", () => {
            const output = atm.logout().join("");

            expect(output).toContain("Goodbye, Bob!");
        });
    });
});