class Calculator {
    constructor(prevDisplay, currDisplay) {
        this.prevDisplay = prevDisplay;
        this.currDisplay = currDisplay;
        this.clear();
    };

    clear() {
        this.currentValue = '';
        this.previousValue = '';
        this.operation = undefined;
    };

    clearEntry() {
        this.currentValue = this.currentValue.toString().slice(0, -1);
    };

    appendDigit(num) {
        if (num === '.' && this.currentValue.includes('.')) return;
        this.currentValue = this.currentValue.toString() + num.toString();
    };

    operators(mathOperator) {
        if (this.currentValue === '') return;
        // For %, we compute immediately
        if (mathOperator === '%') {
            this.computePercentage();
            return;
        }

        if (this.previousValue !== '') {
            this.compute();
        }

        this.operation = mathOperator;
        this.previousValue = this.currentValue;
        this.currentValue = '';
    };

    compute() {
        let computation;
        const prev = parseFloat(this.previousValue);
        const curr = parseFloat(this.currentValue);

        if (isNaN(prev) || isNaN(curr)) return;

        switch (this.operation) {
            case '+':
                computation = prev + curr;
                break;
            case '-':
                computation = prev - curr;
                break;
            case '*':
                computation = prev * curr;
                break;
            case '/':
                computation = prev / curr;
                break;
            default:
                return;
        };

        this.currentValue = computation;
        this.operation = undefined;
        this.previousValue = '';
    };

    // Handle the % operation independently, calculating percentage of the current value
    computePercentage() {
        const curr = parseFloat(this.currentValue);
        if (isNaN(curr)) return;
        this.currentValue = curr / 100;  // Convert to percentage
    }

    getDisplayDigit(num) {
        const strNum = num.toString();

        if (strNum.replace('.', '').length >= 10) {
            return parseFloat(num).toExponential(3);
        }

        const intDigits = parseFloat(strNum.split('.')[0]);
        const decimalDigits = strNum.split('.')[1];
        let intDisplay;
        if (isNaN(intDigits)) {
            intDisplay = '';
        } else {
            intDisplay = intDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${intDisplay}.${decimalDigits}`;
        } else {
            return intDisplay;
        }
    }

    updateDisplay() {
        this.currDisplay.innerText = this.getDisplayDigit(this.currentValue);
        if (this.operation != null) {
            this.prevDisplay.innerText = `${this.getDisplayDigit(this.previousValue)} ${this.operation}`;
        } else {
            this.prevDisplay.innerText = '';
        };
    };
};

const digitBtns = document.querySelectorAll('[data-digit]');
const operatorBtns = document.querySelectorAll('[data-operator]');
const equalsBtn = document.querySelector('[data-equals]');
const clearBtn = document.querySelector('[data-clear-digit]');
const clearAllBtn = document.querySelector('[data-clear-all]');
const prevDisplay = document.querySelector('[data-previous-display]');
const currDisplay = document.querySelector('[data-current-display]');

const calculator = new Calculator(prevDisplay, currDisplay);

digitBtns.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendDigit(button.innerText);
        calculator.updateDisplay();
    });
});

operatorBtns.forEach(button => {
    button.addEventListener('click', () => {
        calculator.operators(button.innerText);
        calculator.updateDisplay();
    });
});

equalsBtn.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});

clearAllBtn.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

clearBtn.addEventListener('click', () => {
    calculator.clearEntry();
    calculator.updateDisplay();
});
