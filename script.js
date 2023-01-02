const calculator = document.querySelector('#calculator');

let currentOperation = null; // + - * /
let ops = ["0"];

const display = document.querySelector('#display');

function updateDisplay(text) {
    const val = parseInt(ops[ops.length - 1]);
    const valStr = val.toString();
    ops[ops.length - 1] = valStr;
    display.textContent = valStr;
}

const buttonClear = document.querySelector('#clear'); 
buttonClear.addEventListener('click', (e) => {
    ops = [0];
    updateDisplay();
});

const buttonsNumber = document.querySelectorAll('.number');
buttonsNumber.forEach(buttonNumber => {
    buttonNumber.addEventListener('click', e => {
        let curr = ops[ops.length - 1];
        if (ops[ops.length - 1].length > 8) return;
        ops[ops.length - 1] = curr + buttonNumber.textContent;
        updateDisplay();
    });
});

function add(a, b) { return a + b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return a / b; }
function subtract(a, b) { return a - b; }

function performOperation() {
    let operation = null;

    switch(currentOperation) {
        case '/':
            operation = divide;
            break;
        case 'x':
            operation = multiply;
            break;
        case '-':
            operation = subtract;
            break;
        case '+':
            operation = add;
            break;
        default:
            ;
    }

    let op1 = parseInt(ops[0]), op2 = parseInt(ops[ops.length - 1]);
    let res = operation(op1, op2);
    ops = [];
    ops.push(res.toString());
    updateDisplay();
}

const buttonsOperation = document.querySelectorAll('.operation');
buttonsOperation.forEach(buttonOperation => {
    buttonOperation.addEventListener('click', e => {
        if (e.target.innerText === '=' && ops.length === 1) return;
        if (currentOperation) {
            performOperation();
        }
        currentOperation = buttonOperation.textContent === '=' ? null : buttonOperation.textContent;
        ops.push("0");
    });
});