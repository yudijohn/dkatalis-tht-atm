# ATM CLI Simulation

A TypeScript command-line interface (CLI) application simulating an ATM's interaction with a retail bank. It supports key ATM functions such as user login/registration, deposits, withdrawals, transfers, and a robust debt tracking/settlement system between users.

---

## 🛠️ Features

- **User Authentication**: Securely log in or register new users automatically (`login [name]`, `logout`).
- **Basic Transactions**: Deposit and withdraw money with validation checking (`deposit [amount]`, `withdraw [amount]`).
- **P2P Transfer with Debt Settlement**: 
  - Transfer money from the logged-in customer to a target customer.
  - If the user has insufficient funds, the ATM transfers whatever is available, sets the user's balance to `$0`, and tracks the debt (e.g. *"Owed $X to [User]"*).
  - Any future deposits or incoming transfers automatically settle outstanding debts.
- **State Persistence (Per Run)**: State is stored in-memory during the CLI session. Each session starts fresh.

---

## 📋 Requirements

- **Node.js**: Version 18 or higher.
- **npm**: (Included with Node.js).

---

## 🚀 Setup & Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd atm
```

### 2. Install Dependencies
Install the required packages (TypeScript, ts-node, and Vitest):
```bash
npm install
```

---

## 🎮 Running the Application

There are two ways to start the interactive ATM CLI:

### Option A: Using the shell script (Recommended)
Make the `start.sh` script executable and run it. This script automatically runs `npm install` silently and starts the CLI:
```bash
chmod +x start.sh
./start.sh
```

### Option B: Using npm script
You can start the TypeScript CLI application directly via npm:
```bash
npm start
```

### Supported CLI Commands

Once the CLI is running (indicated by the `$` prompt), you can use the following commands:

| Command | Description | Example |
| :--- | :--- | :--- |
| `login [name]` | Logs in as the customer. Creates the customer if they do not exist. | `login Alice` |
| `deposit [amount]` | Deposits the specified amount to the logged-in customer. | `deposit 100` |
| `withdraw [amount]` | Withdraws the specified amount from the logged-in customer. | `withdraw 50` |
| `transfer [target] [amount]` | Transfers the specified amount to the target customer. | `transfer Bob 80` |
| `logout` | Logs out of the current customer. | `logout` |
| `exit` | Exits the interactive ATM CLI simulation. | `exit` |

---

## 🧪 Running Tests

The test suite is powered by **Vitest**. To run the automated unit and integration tests:

### Run tests once:
```bash
npm run test
```
or:
```bash
npx vitest run
```

### Run tests in watch mode:
```bash
npx vitest
```

---

## 📁 Repository Structure

```tree
├── docs/
│   └── PROBLEM_ATM.md     # Problem statement and requirements
├── services/
│   ├── auth.service.ts    # Authentication and session logic
│   ├── debt.service.ts    # Debt calculation and settlement logic
│   ├── transaction.service.ts # Deposit, withdrawal, and transfer logic
│   └── user.service.ts    # User CRUD and lookup operations
├── atm.ts                 # Main ATMEngine class / entry controller
├── atm.test.ts            # Unit and functional tests
├── index.ts               # CLI readline loop entry point
├── store.ts               # In-memory global data store
├── types.ts               # TypeScript interface definitions
├── package.json           # Scripts and dependencies configuration
├── tsconfig.json          # TypeScript compilation settings
└── start.sh               # Startup shell script
```
