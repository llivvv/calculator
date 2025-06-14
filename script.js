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
  return a / b;
}

function operate(op, a, b) {
  switch (op) {
    case "add":
      for (let i = 0; i < arrNum.length; i++) {
        console.log(arrNum[i]);
      }
      console.log("addition performed");
      return add(a, b);
    case "subtract":
      return subtract(a, b);
    case "multiply":
      return multiply(a, b);
    case "divide":
      return divide(a, b);
  }
}

function clickDisplay(numStr) {
  if (isAtBeg) {
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
  negNumLast = arrNum[arrNum.length - 1];
}

function intoPcntAndDisplay() {
  //   console.log("here!");
  //   console.log(arrNum.length - 1);
  if (arrNum.length - 1 >= 0) {
    console.log("here?");
    arrNum[arrNum.length - 1] = arrNum[arrNum.length - 1] / 100;
    negNumLast = flipNum(arrNum[arrNum.length - 1]);
    display.innerText = arrNum[arrNum.length - 1];
  }
}

function flipNum(num) {
  return -1 * num;
}

function flipAndDisplay() {
  if (arrNum.length >= 1) {
    negNumLast = arrNum[arrNum.length - 1];
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

function processOp(opName) {
  // pressing an operation button right after you pressed another op button (excludes =)
  if (opName == "equal") {
    if (arrOps.length == 1) {
      console.log("it evaluated");
      console.log(arrNum[0]);
      console.log(arrNum[1]);
      arrNum[0] = operate(arrOps[0], arrNum[0], arrNum[1]);
      arrNum.pop();
      arrOps.pop();
      display.innerText = arrNum[0];
      console.log(arrNum.length);
      prev = "num";
      isDecAvail = false;
      // isDecAvail = true;
    }
    if (arrOps.length == 2) {
      // cases: (+, /), (-, /)
      // ex. 5 + 2/2
      if (
        (arrOps[0] == "add" || arrOps[0] == "subtract") &&
        (arrOps[1] == "divide" || arrOps[1] == "multiply")
      ) {
        arrNum[1] = operate(arrOps[1], arrNum[1], arrNum[2]);
        arrNum.pop();
        arrNum[0] = operate(arrOps[0], arrNum[0], arrNum[1]);
        arrNum.pop();
        display.innerText = arrNum[arrNum.length - 1];
        arrOps.pop();
        arrOps.pop();
        prev = "num";
        isDecAvail = true;
      }
    }
    mostRecentOp = null;
  } else if (prev == "op") {
    // replace old op with the new op
    // ex. 5 /+, 5 +-
    if (opName == "add" || opName == "subtract") {
      replaceOp(opName);
    } else if (opName == "divide" || opName == "multiply") {
      if (mostRecentOp == "add" || "subtract") {
        // check if there was a previous operation evaluated
        // ex. 5 + 2 +/ -> 7 +/ -> 7 - 2/
        // negNumLast = -2 // when do i update this?
        if (negNumLast != 0) {
          arrNum[0] = arrNum[arrNum.length - 1] + negNumLast;
          arrNum[1] = flipNum(negNumLast);
          display.innerText = arrNum[1];

          putNewOp(opName);
          return;
        }
      }

      // handle cases: 5 +/, 5/*
      replaceOp(opName);
    }
  } else {
    // prev was not an operator
    // ex. 5 + 2 +, 5 + 2/2 +,
    if (mostRecentOp == "divide" || mostRecentOp == "multiply") {
      // handles cases: 12/4/ = 3/, 12/4+ = 3+
      arrNum[arrOps.length - 1] = operate(
        mostRecentOp,
        arrNum[arrOps.length - 1],
        arrNum[arrOps.length]
      );
      arrNum.pop();
      arrOps.pop();
      if (!(opName == "divide" || opName == "multiply") && arrOps.length == 2) {
        // aka there was a "+" or "-" before the divide or multiply
        arrNum[arrOps.length - 1] = operate(
          arrOps[arrOps.length - 1],
          arrNum[arrOps.length - 1],
          arrNum[arrOps.length]
        );
        arrNum.pop();
        arrOps.pop();
      }
      display.innerText = arrNum[arrNum.length - 1];
      replaceOp(opName);
      prev = "op";
      // if (arrOps.length = 2) {
      //   // aka there was a "+" before the divide or multiply
      //   arrNum[arrOps.length - 1] = operate(mostRecentOp, arrNum[arrOps.length - 1], arrNum[arrOps.length]);

      // }
    } else if (
      // handles cases: 5 + 2 + -> 7 +
      (mostRecentOp == "add" || mostRecentOp == "subtract") &&
      (opName == "add" || opName == "subtract")
    ) {
      arrNum[arrOps.length - 1] = operate(
        mostRecentOp,
        arrNum[arrOps.length - 1],
        arrNum[arrOps.length]
      );
      arrNum.pop();
      display.innerText = arrNum[arrNum.length - 1];
      replaceOp(opName);
      prev = "op";
    } else if (arrOps.length == 0) {
      putNewOp(opName);
      prev = "op";
    }
  }
}
function clear() {
  arrNum = [0];
  arrOps = [];
  prev = null;
  isDecAvail = true;
  clearBtn.innerText = "AC";
  display.innerText = "0";
  isAtBeg = true;
}

let operator;
// let a;
// let b;
let arrNum = [0];
let Op1 = null;
let Op2 = null;
let negNumLast = 0;
let arrOps = [];
let mostRecentOp = null; // the most recently pressed op

// prevOps: "add", "subtract", "multiply", "divide"
let prevOp = null;

// keep track of whether user's last press was a num or operator or decimal etc.
// choices: "num", "dec", "op", "null"
let prev = null;
let isAtBeg = true;
let isDecAvail = true;

// const opsMap = new Map();
// opsMap.set("")
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

const opBtns = document.querySelectorAll(".btn-op");
opBtns.forEach((opBtn) => {
  opBtn.addEventListener("click", () => {
    // currOp = opBtn.id;
    processOp(opBtn.id);
    // prev = "op";
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

const flipBtn = document.querySelector(".btn-flip");
flipBtn.addEventListener("click", flipAndDisplay);
