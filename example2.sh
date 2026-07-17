#!/bin/bash

# Ensure we are in the script's directory
cd "$(dirname "$0")"

# Run the ATM CLI simulation with the example session commands from docs/PROBLEM_ATM.md
./start.sh <<EOF
login Alice
transfer Bob 50
logout
login Charlie
deposit 100
transfer Alice 50
logout
login Alice
logout
login Bob
EOF
