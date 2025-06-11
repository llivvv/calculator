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

function clickDisplay(numStr) {
  if (prev == "num" || prev == "dec") {
    display.innerText += numStr;
  } else {
    display.innerText = numStr;
  }
}

let operator;
let a;
let b;

// keep track of whether user's last press was a num or operator or decimal etc.
let prev = null;
let isDecAvail = true;

const display = document.querySelector(".display");
const clearBtn = document.querySelector(".btn-clear");
const numBtns = document.querySelectorAll(".btn-num");
numBtns.forEach((numBtn) => {
  numBtn.addEventListener("click", () => {
    clickDisplay(numBtn.innerText);
    prev = "num";
    clearBtn.innerText = "C";
  });
});

const decBtn = document.querySelector(".btn-dec");
decBtn.addEventListener("click", () => {
  if (isDecAvail) {
    clickDisplay(".");
    prev = "dec";
    isDecAvail = false;
    clearBtn.innerText = "C";
  }
});
