// set up variables
let arrNum = [0];
// let negNumLast = 0;
let arrOps = [];
let mostRecentOp = null; // the most recently pressed op. arrOps[arrOps.length - 1]
let prev = null; // prev choices: "num", "dec", "op", "null"
let isAtBeg = true;
let justEvaluatedEqual = false;
let isAddSubtractEval = false; // does not include evaluations of additions or subtractions from equals
let justEvaluatedOp = null;
// const oppOfOp = new Map();
const oppOfOp = new Map([
  ["add", "subtract"],
  ["subtract", "add"],
  ["multiply", "divide"],
  ["divide", "multiply"],
]);
let numLast = 0;

// select elements
const display = document.querySelector(".display");
const pcntBtn = document.querySelector(".btn-pcnt");
const clearBtn = document.querySelector(".btn-clear");
const numBtns = document.querySelectorAll(".btn-num");
const opBtns = document.querySelectorAll(".btn-op");
const eqBtn = document.getElementById("equal");
const decBtn = document.querySelector(".btn-dec");
const flipBtn = document.querySelector(".btn-flip");

// add event listeners
pcntBtn.addEventListener("click", intoPcntAndDisplay);
clearBtn.addEventListener("click", clear);
numBtns.forEach((numBtn) => {
  numBtn.addEventListener("click", () => {
    clickDisplay(numBtn.innerText);
    prev = "num";
    clearBtn.innerText = "C";
  });
});
opBtns.forEach((opBtn) => {
  opBtn.addEventListener("click", () => {
    processOp(opBtn.id);
  });
});
eqBtn.addEventListener("click", processEqual);
decBtn.addEventListener("click", () => {
  if (checkIsDecAvail()) {
    clickDisplay(".");
    prev = "dec";
    clearBtn.innerText = "C";
  }
});
flipBtn.addEventListener("click", flipAndDisplay);

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b == 0) {
    return "Error";
  }
  return a / b;
  // b == 0 ? "error" : (a / b);
  // return a / b;
}

function operate(op, a, b) {
  switch (op) {
    case "add":
      console.log(`added ${a} and ${b}`);
      isAddSubtractEval = true;
      return add(a, b);
    case "subtract":
      console.log(`subtracted ${a} and ${b}`);
      isAddSubtractEval = true;
      return subtract(a, b);
    case "multiply":
      console.log(`multiplied ${a} and ${b}`);
      return multiply(a, b);
    case "divide":
      console.log(`divided ${a} and ${b}`);
      return divide(a, b);
  }
}

function clickDisplay(numStr) {
  if (isAtBeg || justEvaluatedEqual) {
    display.innerText = numStr;
    arrNum[arrNum.length - 1] = parseFloat(display.innerText);
    isAtBeg = false;
  } else if (prev == "num" || prev == "dec" || isAtBeg) {
    display.innerText += numStr;
    arrNum[arrNum.length - 1] = parseFloat(display.innerText);
  } else {
    display.innerText = numStr;
    arrNum.push(parseFloat(numStr));
  }
  // negNumLast = arrNum[arrNum.length - 1];
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

function flipNum(num) {
  return -1 * num;
}

function flipAndDisplay() {
  console.log("worked");
  if (arrNum.length >= 1) {
    // negNumLast = arrNum[arrNum.length - 1];
    arrNum[arrNum.length - 1] = flipNum(arrNum[arrNum.length - 1]);
    display.innerText = arrNum[arrNum.length - 1];
  }
}

function replaceOp(opName) {
  arrOps[arrOps.length - 1] = opName;
  mostRecentOp = opName;
}

function putNewOp(opName) {
  arrOps.push(opName);
  mostRecentOp = opName;
}

function checkIsDecAvail() {
  return !display.innerText.includes(".");
}

function calc() {
  setNumLast();
  justEvaluatedOp = arrOps[arrOps.length - 1];
  arrNum[arrOps.length - 1] = operate(
    arrOps[arrOps.length - 1],
    arrNum[arrOps.length - 1],
    arrNum[arrOps.length]
  );
  // arrNum.pop();
  // arrOps.pop();
}

function evalSingleOpOnEqual() {
  // arrNum[0] = operate(arrOps[0], arrNum[0], arrNum[1]);
  // arrNum.pop();
  // arrOps.pop();
  calc();
  arrNum.pop();
  arrOps.pop();
  display.innerText = arrNum[0];
  prev = "num";
}

function evalTwoOpsOnEqual() {
  // arrNum[1] = operate(arrOps[1], arrNum[1], arrNum[2]);
  // arrNum.pop();
  // arrOps.pop();
  for (let i = 0; i < arrNum.length; i++) {
    console.log(`at idx: ${arrNum[i]}`);
  }
  calc();
  arrNum.pop();
  arrOps.pop();
  evalSingleOpOnEqual();
}

function processEqual() {
  for (let i = 0; i < arrOps.length; i++) {
    console.log(arrOps[i]);
  }
  if (arrOps.length == 1) {
    evalSingleOpOnEqual();
  }
  if (arrOps.length == 2) {
    // cases: (+, /), (-, /)
    // ex. 5 + 2/2
    if (
      (arrOps[0] == "add" || arrOps[0] == "subtract") &&
      (arrOps[1] == "divide" || arrOps[1] == "multiply")
    ) {
      evalTwoOpsOnEqual();
    }
  }
  mostRecentOp = null;
  justEvaluatedEqual = true;
}

function processDoubleOpClick(opName) {
  console.log("redo");
  // replace old op with the new op
  // ex. 5 /+, 5 +-
  if (opName == "add" || opName == "subtract") {
    replaceOp(opName);
  } else if (opName == "divide" || opName == "multiply") {
    if (mostRecentOp == "add" || "subtract") {
      // check if there was a previous operation evaluated
      // ex. 5 + 2 +/ -> 7 +/ -> 7 - 2/
      // negNumLast = -2 // when do i update this?
      if (!isAddSubtractEval) {
        // case: 5 +/
        replaceOp(opName);
      } else {
        // undo the previously evaluated addition/subtraction
        arrNum[0] = operate(oppOfOp.get(justEvaluatedOp), arrNum[0], numLast);
        arrOps[arrOps.length - 1] = justEvaluatedOp;
        // console.log(arrOps[0]);
        arrNum.push(numLast);
        display.innerText = arrNum[1];
        putNewOp(opName);
        mostRecentOp = opName;
      }
    }

    // handle cases: 5 +/, 5/*
    replaceOp(opName);
  }
}

// this logic is off
// function setNegNumLast() {
//   if (mostRecentOp == "subtract") {
//     negNumLast = arrNum[arrNum.length - 1];
//   } else {
//     negNumLast = flipNum(arrNum[arrNum.length - 1]);
//   }
// }

function setNumLast() {
  numLast = arrNum[arrNum.length - 1];
}

// prev was not an operator
function processSingleOpClick(opName) {
  // ex. 5 + 2 +, 5 + 2/2 +,
  if (mostRecentOp == "divide" || mostRecentOp == "multiply") {
    // handles cases: 12/4/ = 3/, 12/4+ = 3+
    calc();
    arrNum.pop();
    arrOps.pop();
    isAddSubtractEval = false;
    if (!(opName == "divide" || opName == "multiply") && arrOps.length == 1) {
      // aka there was a "+" or "-" before the divide or multiply
      calc();
      arrNum.pop();
      arrOps.pop();
      isAddSubtractEval = true;
    }
    display.innerText = arrNum[arrNum.length - 1];
    console.log(arrOps.length);
    putNewOp(opName);
    prev = "op";
    // isAddSubtractEval = false;
  } else if (
    // handles cases: 5 + 2 + -> 7 +
    (mostRecentOp == "add" || mostRecentOp == "subtract") &&
    (opName == "add" || opName == "subtract")
  ) {
    isAddSubtractEval = true;
    calc();
    arrNum.pop();
    display.innerText = arrNum[arrNum.length - 1];
    replaceOp(opName);
    prev = "op";
  } else {
    putNewOp(opName);
    prev = "op";
  }
}

// opName excludes equal
function processOp(opName) {
  console.log(opName);
  // pressing an operation button right after you pressed another op button (excludes =)
  if (prev == "op") {
    processDoubleOpClick(opName);
  } else {
    // prev was not an operator
    processSingleOpClick(opName);
  }
  justEvaluatedEqual = false;
  isAtBeg = false;
  console.log(arrNum[0]);
}

function clear() {
  arrNum = [0];
  arrOps = [];
  prev = null;
  clearBtn.innerText = "AC";
  display.innerText = "0";
  isAtBeg = true;
  // negNumLast = 0;
  mostRecentOp = null;
  justEvaluatedEqual = false;
  isAddSubtractEval = false;
  // prevOp = null;
}
