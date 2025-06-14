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
  if (prev == "num" || prev == "dec") {
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
  if (arrNum.length - 1 >= 1) {
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
  if (opName === "equal") {
    if (arrOps.length == 2) {
      // cases: (+, /), (-, /)
      // ex. 5 + 2/2
      if (
        ((arrOps[0] === "add" || arrOps[0] === "subtract") &&
          arrOps[1] === "divide") ||
        arrOps[1] === "multiply"
      ) {
        arrNum[1] = operate(arrOps[1], arrNum[1], arrNum[2]);
        arrNum.pop();
        arrNum[0] = operate(arrOps[0], arrNum[0], arrNum[1]);
        arrNum.pop();
      }
    }
  }
  if (prev === "op") {
    // replace old op with the new op
    // ex. 5 /+, 5 +-
    if (opName === "add" || opName === "subtract") {
      replaceOp(opName);
    } else if (opName === "divide" || opName === "multiply") {
      if (mostRecentOp === "add" || "subtract") {
        // check if there was a previous operation evaluated
        // ex. 5 + 2 +/ -> 7 +/ -> 7 - 2/
        // negNumLast = -2 // when do i update this?
        if (negNumLast != 0) {
          arrNum[0] = arrNum[arrNum.length - 1] + negNumLast;
          arrNum[1] = flipNum(negNumLast);

          putNewOp(opName);
          return;
        }
      }

      // handle cases: 5 +/, 5/*
      replaceOp(opName);
    }

    // (arrOps[arrOps.length - 1] === "addition" ||
    //   arrOps[arrOps.length - 1] === "subtraction") &&
    // (opName === "addition" || opName === "subtraction")
    //  {
    // // replace the old op with the new op
    // arrOps[arrOps.length - 1] = opName;
  } else {
  }
}
function clear() {
  arrNum = [0];
  arrOps = [];
  prev = null;
  isDecAvail = true;
  clearBtn.innerText = "AC";
  display.innerText = "0";
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
