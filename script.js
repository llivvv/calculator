// set up variables
let arrNum = [0];
let arrOps = [];
let mostRecentOp = null; // the most recently pressed op. arrOps[arrOps.length - 1]
let prev = null; // prev choices: "num", "dec", "op", "null"
let isAtBeg = true;
let justEvaluatedEqual = false;
let isAddSubtractEval = false; // does not include evaluations of additions or subtractions from equals
let justEvaluatedOp = null;
let lastOp = null;
let numLast = 0;
let isError = false;

// key: the original operator, value: its opposite
// used for undoing operations
const oppOfOp = new Map([
  ["add", "subtract"],
  ["subtract", "add"],
  ["multiply", "divide"],
  ["divide", "multiply"],
]);

// select elements
const display = document.querySelector(".display");
const pcntBtn = document.querySelector(".btn-pcnt");
const clearBtn = document.querySelector(".btn-clear");
const delBtn = document.querySelector(".btn-del");
const numBtns = document.querySelectorAll(".btn-num");
const opBtns = document.querySelectorAll(".btn-op");
const eqBtn = document.getElementById("equal");
const decBtn = document.querySelector(".btn-dec");
const flipBtn = document.querySelector(".btn-flip");

// add event listeners
pcntBtn.addEventListener("click", () => {
  if (!isError) intoPcntAndDisplay();
});
clearBtn.addEventListener("click", clear);
delBtn.addEventListener("click", deleteNum);
numBtns.forEach((numBtn) => {
  numBtn.addEventListener("click", () => {
    if (!isError) {
      if (numBtn.innerText != 0 || !isAtBeg) {
        console.log("this got processed");
        clickDisplay(numBtn.innerText);
        prev = "num";
        makeDelBtnVisible();
      }
    }
  });
});
opBtns.forEach((opBtn) => {
  if (!isError) {
    opBtn.addEventListener("click", () => {
      processOp(opBtn.id);
    });
  }
});
eqBtn.addEventListener("click", () => {
  if (!isError) processEqual();
});
decBtn.addEventListener("click", () => {
  if (!isError) {
    if (checkIsDecAvail()) {
      clickDisplay(".");
      prev = "dec";
      makeDelBtnVisible();
    }
  }
});
flipBtn.addEventListener("click", () => {
  if (!isError) {
    flipAndDisplay();
  }
});

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
  // if (b == 0 || a / b == "undefined")
  console.log(a / b);
  if (b == 0) {
    isError = true;
    return "Error";
  }
  return a / b;
  // b == 0 ? "error" : (a / b);
  // return a / b;
}

function operate(op, a, b) {
  switch (op) {
    case "add":
      isAddSubtractEval = true;
      return add(a, b);
    case "subtract":
      isAddSubtractEval = true;
      return subtract(a, b);
    case "multiply":
      return multiply(a, b);
    case "divide":
      return divide(a, b);
  }
}

function clickDisplay(numStr) {
  if ((isAtBeg || prev == "Op") && numStr == ".") {
    display.innerText = "0.";
    isAtBeg = false;
    arrNum[arrNum.length - 1] = parseFloat(display.innerText);
  } else if (isAtBeg || justEvaluatedEqual) {
    display.innerText = numStr;
    arrNum[arrNum.length - 1] = parseFloat(display.innerText);
    isAtBeg = false;
  } else if (prev == "num" || prev == "dec" || isAtBeg) {
    // replace display 0 with the actual number
    if (
      parseFloat(display.innerText) == 0 &&
      numStr != "." &&
      !display.innerText.includes(".")
    )
      return;
    if (display.innerText.length < 7) {
      display.innerText += numStr;
      arrNum[arrNum.length - 1] = parseFloat(display.innerText);
    }
  } else {
    display.innerText = numStr;
    arrNum.push(parseFloat(numStr));
  }
}

function intoPcntAndDisplay() {
  if (arrNum.length - 1 >= 0) {
    console.log("here?");
    arrNum[arrNum.length - 1] = arrNum[arrNum.length - 1] / 100;
    resDisplay(arrNum.length - 1);
  }
}

function flipNum(num) {
  return -1 * num;
}

function flipAndDisplay() {
  if (arrNum.length >= 1) {
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
}

// limits number of digits to display after calculations
function resDisplay(arrIdx) {
  let num = arrNum[arrIdx];
  let strNum = String(arrNum[arrIdx]);
  if (num > 9999999) {
    display.innerText = num.toExponential(2);
  } else if (strNum.length >= 7) {
    let resArr = strNum.split(".");
    let digitsDeciAllowed = 7 - resArr[0].length;
    display.innerText = num.toFixed(digitsDeciAllowed);
  } else {
    display.innerText = num;
  }
}

function evalSingleOpOnEqual() {
  calc();
  arrNum.pop();
  arrOps.pop();
  resDisplay(0);
  prev = "num";
}

function evalTwoOpsOnEqual() {
  calc();
  arrNum.pop();
  arrOps.pop();
  isError ? resDisplay(arrNum.length - 1) : evalSingleOpOnEqual();
}

function processEqual() {
  if (arrNum.length == arrOps.length && arrNum.length >= 1) {
    console.log("processed special case");
    lastOp = arrOps[arrOps.length - 1];

    setNumLast();
    justEvaluatedOp = arrOps[arrOps.length - 1];
    arrNum[arrOps.length - 1] = operate(
      arrOps[arrOps.length - 1],
      arrNum[arrOps.length - 1],
      arrNum[arrOps.length - 1]
    );
    arrOps.pop();
    resDisplay(0);
    prev = "num";
    console.log(`num length: ${arrNum.length}, ops length: ${arrOps.length}`);
    mostRecentOp = null;
    justEvaluatedEqual = true;
    return;
  }
  if (arrOps.length == 0 && lastOp != null) {
    // eval equal again
    let newRes = operate(lastOp, arrNum[0], numLast);
    arrNum[0] = newRes;
    resDisplay(0);
  }
  if (arrOps.length == 1) {
    setNumLast();
    lastOp = arrOps[arrOps.length - 1];
    evalSingleOpOnEqual();
  }
  if (arrOps.length == 2) {
    // cases: (+, /), (-, /)
    // ex. 5 + 2/2
    if (
      (arrOps[0] == "add" || arrOps[0] == "subtract") &&
      (arrOps[1] == "divide" || arrOps[1] == "multiply")
    ) {
      setNumLast();
      lastOp = arrOps[arrOps.length - 1];
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
        arrNum.push(numLast);
        resDisplay(1);
        putNewOp(opName);
        mostRecentOp = opName;
      }
    }

    // handle cases: 5 +/, 5/*
    replaceOp(opName);
  }
}

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
    if (
      !(opName == "divide" || opName == "multiply") &&
      arrOps.length == 1 &&
      !isError
    ) {
      // aka there was a "+" or "-" before the divide or multiply
      calc();
      arrNum.pop();
      arrOps.pop();
      isAddSubtractEval = true;
    }
    resDisplay(arrNum.length - 1);
    console.log(arrOps.length);
    putNewOp(opName);
    prev = "op";
  } else if (
    // handles cases: 5 + 2 + -> 7 +
    (mostRecentOp == "add" || mostRecentOp == "subtract") &&
    (opName == "add" || opName == "subtract")
  ) {
    isAddSubtractEval = true;
    calc();
    arrNum.pop();
    resDisplay(arrNum.length - 1);
    replaceOp(opName);
    prev = "op";
  } else {
    putNewOp(opName);
    prev = "op";
  }
}

// opName excludes equal
function processOp(opName) {
  justEvaluatedEqual = false;
  isAtBeg = false;
  console.log(arrNum[0]);
  console.log(opName);
  // pressing an operation button right after you pressed another op button (excludes =)
  if (prev == "op") {
    processDoubleOpClick(opName);
  } else {
    // prev was not an operator
    processSingleOpClick(opName);
  }
}

function clear() {
  arrNum = [0];
  arrOps = [];
  prev = null;
  display.innerText = "0";
  isAtBeg = true;
  mostRecentOp = null;
  justEvaluatedEqual = false;
  isAddSubtractEval = false;
  justEvaluatedOp = null;
  lastOp = null;
  isError = false;
  numLast = 0;
}

function makeACBtnVisible() {
  clearBtn.classList.remove("hidden");
  delBtn.classList.add("hidden");
}

function makeDelBtnVisible() {
  delBtn.classList.remove("hidden");
  clearBtn.classList.add("hidden");
}

// for "C" button
function deleteNum() {
  makeACBtnVisible();
  if (prev == "num" && !isError && !justEvaluatedEqual) {
    arrNum[arrNum.length - 1] = 0;
    display.innerText = "0";
  } else if (isError || justEvaluatedEqual) {
    // delete btn acts like clear btn if error
    makeACBtnVisible();
    clear();
  }
}
