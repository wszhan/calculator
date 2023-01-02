const calculator = document.querySelector('#calculator');
const display = document.querySelector('#display');
const buttonClear = document.querySelector('#clear'); 
const buttonsNumber = document.querySelectorAll('.number');
const buttonsOperation = document.querySelectorAll('.operation');
const buttonsTransformation = document.querySelectorAll('.transformation');

let currentOperation = null; // + - * /
let ops = ["0"];
const SYMBOL_ADD = '+',
    SYMBOL_SUBTRACT = '-',
    SYMBOL_MULTIPLY = '*',
    SYMBOL_EQUAL = '=',
    SYMBOL_DIVIDE = '/',
    SYMBOL_SIGN_REVERSE = '+/-',
    SYMBOL_PERCENTAGE = '%',
    SYMBOL_DECIMAL = '.';
const DISPLAY_LENGTH_MAX = 9;
const ERROR_MSG = "ERROR";

/* Functions */

function init() {
    updateDisplay();
}

function updateDisplay() {
    const lastOp = ops[ops.length - 1];
    // console.log(typeof lastOp, lastOp);
    const val = parseFloat(lastOp);
    const valStr = val.toString();
    ops[ops.length - 1] = valStr; // update data
    display.textContent = valStr; // update DOM/display
}

function add(a, b) { return a + b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return a / b; }
function subtract(a, b) { return a - b; }
function reverseSign(str) { 
    if (str[0] === '-') { // already negative
        return str.substring(1);
    }

    return '-' + str; 
}
function convertToPercentage(str) { 
    if (typeof str !== 'string') {
        return ERROR_MSG;
    }
        
    if (str.length > DISPLAY_LENGTH_MAX - 2) {
        return; // number string too long; do nothing
    }

    const decimalPrefix = '0.0';

    if (str[0] === '-') { // negative
        return '-0.' + str.substring(1);
    }

    if (str.includes(SYMBOL_DECIMAL)) {
        const decimalIndex = str.indexOf(SYMBOL_DECIMAL);
        const decimalPart = str.substring(decimalIndex + 1);
        return decimalPrefix + decimalPart;
    }

    return decimalPrefix + str; 
}

function performTransformation(transformationSymbol) {
    const op = ops[ops.length - 1];

    let res = null;

    switch (transformationSymbol) {
        case SYMBOL_PERCENTAGE:
            res = convertToPercentage(op);
            break;
        case SYMBOL_SIGN_REVERSE:
            res = reverseSign(op);
            break;
        default: ;
    }
    
    ops[ops.length - 1] = res;

    updateDisplay();
}

function performOperation() {
    let operation = null;

    switch(currentOperation) {
        case SYMBOL_DIVIDE:
            operation = divide;
            break;
        case SYMBOL_MULTIPLY:
            operation = multiply;
            break;
        case SYMBOL_SUBTRACT:
            operation = subtract;
            break;
        case SYMBOL_ADD:
            operation = add;
            break;
        default:
            ;
    }

    let op1 = parseFloat(ops[0]), op2 = parseFloat(ops[ops.length - 1]);

    let res = null;
    
    if (operation === SYMBOL_SIGN_REVERSE) {
        res = operation(op1);
    } else {
        res = operation(op1, op2)
    }
    ops = [];
    ops.push(res.toString());
    updateDisplay();
}

/* Event Listeners */

buttonsTransformation.forEach(btn => btn.addEventListener('click', e => {
    const symbol = btn.textContent;
    performTransformation(symbol);
}));

buttonClear.addEventListener('click', e => {
    ops = [0];
    updateDisplay();
});

buttonsNumber.forEach(buttonNumber => {
    buttonNumber.addEventListener('click', e => {
        let curr = ops[ops.length - 1];
        if (ops[ops.length - 1].length >= DISPLAY_LENGTH_MAX) return;
        ops[ops.length - 1] = curr + buttonNumber.textContent;
        updateDisplay();
    });
});


buttonsOperation.forEach(buttonOperation => {
    buttonOperation.addEventListener('click', e => {
        if (e.target.innerText === '=' && ops.length === 1) return;
        if (currentOperation) {
            performOperation();
        }
        
        if (buttonOperation.textContent === SYMBOL_EQUAL) {
            currentOperation = null;
            return;
        }

        currentOperation = buttonOperation.textContent;
        ops.push("0");
    });
});

/* Execution */

init();