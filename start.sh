#!/bin/bash

cd "$(dirname "$0")"
npm install --silent
npx ts-node index.ts