function add(a, b) {
  console.log(a + b);
}

function subtract(a, b) {
  console.log(a - b);
}

function multiply(a, b) {
  console.log(a * b);
}

function divide(a, b) {
  console.log(a / b);
}

function operate(op, a, b) {
  switch (op) {
    case "+":
      add(a, b);
      break;
    case "-":
      subtract(a, b);
      break;
    case "*":
      multiply(a, b);
      break;
    case "/":
      divide(a, b);
  }
}

let operator;
let a;
let b;

// keep track of whether user's last press was a num or operator or decimal etc.
let prev;
