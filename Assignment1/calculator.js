const operation = process.argv[2];
const num1 = Number(process.argv[3]);
const num2 = Number(process.argv[4]);

console.log("Smart Calculator");
console.log("----------------");

if (isNaN(num1) || isNaN(num2)) {
    console.log("Please enter valid numbers.");
    console.log("Example: node calculator.js add 10 5");
    process.exit();
}

switch (operation) {
    case "add":
        console.log("Result:", num1 + num2);
        break;

    case "subtract":
        console.log("Result:", num1 - num2);
        break;

    case "multiply":
        console.log("Result:", num1 * num2);
        break;

    case "divide":
        if (num2 === 0) {
            console.log("Error: Cannot divide by zero.");
        } else {
            console.log("Result:", num1 / num2);
        }
        break;

    default:
        console.log("Invalid operation.");
        console.log("Use: add, subtract, multiply, divide");
}