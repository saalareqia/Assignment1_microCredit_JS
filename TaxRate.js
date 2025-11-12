const Tax = 0.0825;
const subtotal = 100;
const tax = subtotal * tax;
const total = subtotal + tax;

console.log("Subtotal: $" + subtotal.toFixed(2));
console.log("Tax: $" + tax.toFixed(2));
console.log("Total: $" + total.toFixed(2));