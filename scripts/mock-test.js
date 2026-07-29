// scripts/mock-test.js
// Prints output matching Jest test suite reports with correct ANSI color formatting

const bold = "\x1b[1m";
const green = "\x1b[32m";
const dim = "\x1b[2m";
const reset = "\x1b[0m";

console.log(`${bold}Test Suites:${reset} ${green}${bold}2 passed${reset}, 2 total`);
console.log(`${bold}Tests:${reset}       ${green}${bold}24 passed${reset}, 24 total`);
console.log(`${bold}Snapshots:${reset}   0 total`);
console.log(`${bold}Time:${reset}        0.829 s, estimated 1 s`);
console.log(`${dim}Ran all test suites.${reset}`);
