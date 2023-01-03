const calculator = document.querySelector('#calculator');
const display = document.querySelector('#display');

const expression = display.querySelector('#expression');
const result = display.querySelector('#result');

const buttonClear = document.querySelector('#clear'); 
const buttonsNumber = document.querySelectorAll('.number');
const buttonsOperation = document.querySelectorAll('.operation');
const buttonsTransformation = document.querySelectorAll('.transformation');

let currentOperation = null; // + - * /
let ops = [];
const SYMBOL_ADD = '+',
    SYMBOL_SUBTRACT = '-',
    SYMBOL_MULTIPLY = '*',
    SYMBOL_EQUAL = '=',
    SYMBOL_DIVIDE = '/',
    SYMBOL_SIGN_REVERSE = '+/-',
    SYMBOL_PERCENTAGE = '%',
    SYMBOL_DECIMAL = '.';
const DISPLAY_LENGTH_MAX = 9;
const ERROR_MSG = "ERROR", INITIAL_DISPLAY_VALUE = '0';

const ESC_KEY = 'Escape', 
    ENTER_KEY = 'Enter';
const NUMBER_KEYS = [];
const TRANSFORMATION_KEYS = [
    SYMBOL_PERCENTAGE
];
const OPERATION_KEYS = [
    SYMBOL_ADD,
    SYMBOL_DIVIDE,
    SYMBOL_EQUAL,
    SYMBOL_MULTIPLY,
    SYMBOL_SUBTRACT
];

/* Functions */

function init() {
    updateDisplay();
    initNumberKeys();
}

function initNumberKeys() {
    // const prefix = 'Digit';
    for (let i = 0; i <= 9; i++) {
        NUMBER_KEYS.push(i.toString());
    }
}

function updateExpression(exprStr = null) {
    if (exprStr !== null) {
        expression.textContent = exprStr;
        return;
    }

    expression.textContent = parseFloat(ops[0]) + ' ' 
        + (currentOperation ? currentOperation : '')
        + (ops.length > 1 ? ' ' + parseFloat(ops[ops.length - 1]) : '')
}

function updateResult(resultValue = INITIAL_DISPLAY_VALUE) {
    updateExpression('');
    result.textContent = resultValue;
    currentOperation = null;
}

function updateDisplay() {
    if (ops.length === 0) {
        updateResult(); return;
    }
    const lastOp = ops[ops.length - 1];
    const val = parseFloat(lastOp);
    const valStr = val.toString();
    ops[ops.length - 1] = valStr; // update data
    // display.textContent = valStr; // update DOM/display
    updateResult(valStr); // update DOM/display
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

    let sign = '', integralPart = '0';

    if (str[0] === '-') { // negative and no decimal
        sign = '-';
        str = str.substring(1); // strip negative sign
    }
    let decimalPart = str;

    // already a decimal
    if (str.includes(SYMBOL_DECIMAL)) {
        const decimalIndex = str.indexOf(SYMBOL_DECIMAL);
        integralPart = str.substring(0, decimalIndex);
        decimalPart = '00' + str.substring(decimalIndex + 1);
    }

    // console.log(sign, integralPart, SYMBOL_DECIMAL, decimalPart);
    return sign + integralPart + SYMBOL_DECIMAL + decimalPart;
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

    // updateDisplay();
    updateExpression(); // affect the last operand only
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
    clearAll();
});

function clearAll() {
    ops = [0];
    updateDisplay();
}

function performNumberEvent(operandKeyCode) {
        if (ops.length === 0) ops.push('0');
        let curr = ops[ops.length - 1];
        if (ops[ops.length - 1].length >= DISPLAY_LENGTH_MAX) return;
        ops[ops.length - 1] = curr + operandKeyCode;
        // updateDisplay();
        updateExpression();

}

buttonsNumber.forEach(buttonNumber => {
    buttonNumber.addEventListener('click', e => {
        performNumberEvent(e.target.innerText);
    });
});

function performOperationEvent(operationKeyCode) {
    if (operationKeyCode === '=' && ops.length === 1) return;
    if (currentOperation) {
        performOperation();
    }
    
    if (operationKeyCode === SYMBOL_EQUAL) {
        currentOperation = null;
        return;
    }

    currentOperation = operationKeyCode;
    updateExpression();
    ops.push('0');
}

buttonsOperation.forEach(buttonOperation => {
    buttonOperation.addEventListener('click', e => {
        performOperationEvent(e.target.innerText);
    });
});

window.addEventListener('keydown', e => {
    const key = e.key, code = e.code;
    // console.log(key, code);
    // console.log(OPERATION_KEYS);
    // console.log(NUMBER_KEYS);
    // console.log(OPERATION_KEYS.includes(key), NUMBER_KEYS.includes(key));
    /* special cases */
    if (key === ENTER_KEY) {
        performOperationEvent(SYMBOL_EQUAL);
        return;
    }
    if (key === ESC_KEY) {
        clearAll();
        return;
    }
    if (key === SYMBOL_DECIMAL) {
        performNumberEvent(key);
        return;
    }
    if (TRANSFORMATION_KEYS.includes(key)) {
        performTransformation(key);
        return;
    }
    if (OPERATION_KEYS.includes(key)) {
        // console.log("operATION");
        performOperationEvent(key);
        return;
    } 
    if (NUMBER_KEYS.includes(key)) {
        // console.log("operAND");
        performNumberEvent(key);
        return;
    }
});

/* Execution */

init();