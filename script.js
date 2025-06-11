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
    arrNum[arrNum.length - 1] = parseFloat(display.innerText);
  } else {
    display.innerText = numStr;
    arrNum.push(parseFloat(numStr));
  }
}

function intoPcntAndDisplay() {
  //   console.log("here!");
  //   console.log(arrNum.length - 1);
  if (arrNum.length - 1 >= 0) {
    console.log("here?");
    arrNum[arrNum.length - 1] = arrNum[arrNum.length - 1] / 100;
    display.innerText = arrNum[arrNum.length - 1];
  }
}

function clear() {
  arrNum = [];
  arrOps = [];
  prev = null;
  isDecAvail = true;
  clearBtn.innerText = "AC";
  display.innerText = "0";
}

let operator;
let a;
let b;
let arrNum = [];
let arrOps = [];

// keep track of whether user's last press was a num or operator or decimal etc.
let prev = null;
let isDecAvail = true;

const display = document.querySelector(".display");
const clearBtn = document.querySelector(".btn-clear");
clearBtn.addEventListener("click", clear);
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

const pcntBtn = document.querySelector(".btn-pcnt");
pcntBtn.addEventListener("click", intoPcntAndDisplay);
