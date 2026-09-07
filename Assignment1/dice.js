import { randomInt } from "node:crypto";

function rollDice() {
    return randomInt(1, 7);
}

console.log("Random Dice Generator");
console.log("---------------------");

for (let i = 1; i <= 5; i++) {
    const diceValue = rollDice();
    console.log(`Roll ${i}: Dice Rolled: ${diceValue}`);
}