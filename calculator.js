class Calculator {
    constructor() {
        this.displayResult = document.getElementById('result');
        this.displayHistory = document.getElementById('history');
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.history = '';
    }

    updateDisplay() {
        this.displayResult.textContent = this.currentInput;
        this.displayHistory.textContent = this.history;
    }

    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentInput = number;
            this.shouldResetDisplay = false;
        } else {
            if (number === '.' && this.currentInput.includes('.')) return;
            if (this.currentInput === '0' && number !== '.') {
                this.currentInput = number;
            } else {
                this.currentInput += number;
            }
        }
        this.updateDisplay();
    }

    appendOperator(op) {
        if (this.operator !== null && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.operator = op;
        this.previousInput = this.currentInput;
        this.history = `${this.currentInput} ${this.getOperatorSymbol(op)}`;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    getOperatorSymbol(op) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷',
            '^': '^'
        };
        return symbols[op] || op;
    }

    calculate() {
        if (this.operator === null || this.shouldResetDisplay) return;

        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);

        if (isNaN(prev) || isNaN(current)) {
            this.showError();
            return;
        }

        let result;
        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.showError('Fehler: Division durch 0');
                    return;
                }
                result = prev / current;
                break;
            case '^':
                result = Math.pow(prev, current);
                break;
            default:
                return;
        }

        this.history = `${this.previousInput} ${this.getOperatorSymbol(this.operator)} ${this.currentInput} =`;
        this.currentInput = this.formatResult(result);
        this.operator = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    calculateFunction(func) {
        const current = parseFloat(this.currentInput);

        if (isNaN(current)) {
            this.showError();
            return;
        }

        let result;
        let funcDisplay = '';

        switch (func) {
            case 'sin':
                result = Math.sin(this.degreesToRadians(current));
                funcDisplay = `sin(${current})`;
                break;
            case 'cos':
                result = Math.cos(this.degreesToRadians(current));
                funcDisplay = `cos(${current})`;
                break;
            case 'tan':
                result = Math.tan(this.degreesToRadians(current));
                funcDisplay = `tan(${current})`;
                break;
            case 'sqrt':
                if (current < 0) {
                    this.showError('Fehler: Negative Wurzel');
                    return;
                }
                result = Math.sqrt(current);
                funcDisplay = `√(${current})`;
                break;
            case 'log':
                if (current <= 0) {
                    this.showError('Fehler: Log von ≤ 0');
                    return;
                }
                result = Math.log10(current);
                funcDisplay = `log(${current})`;
                break;
            case 'ln':
                if (current <= 0) {
                    this.showError('Fehler: ln von ≤ 0');
                    return;
                }
                result = Math.log(current);
                funcDisplay = `ln(${current})`;
                break;
            default:
                return;
        }

        this.history = funcDisplay;
        this.currentInput = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    formatResult(number) {
        if (!isFinite(number)) {
            return 'Fehler';
        }

        // Runde auf 10 Dezimalstellen, um Rundungsfehler zu vermeiden
        const rounded = Math.round(number * 10000000000) / 10000000000;

        // Wenn die Zahl sehr klein oder sehr groß ist, verwende wissenschaftliche Notation
        if (Math.abs(rounded) > 1e10 || (Math.abs(rounded) < 1e-6 && rounded !== 0)) {
            return rounded.toExponential(6);
        }

        // Entferne trailing zeros nach dem Dezimalpunkt
        return rounded.toString();
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.history = '';
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    deleteLast() {
        if (this.shouldResetDisplay) {
            this.clear();
            return;
        }

        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }

    toggleSign() {
        if (this.currentInput === '0') return;

        if (this.currentInput.startsWith('-')) {
            this.currentInput = this.currentInput.slice(1);
        } else {
            this.currentInput = '-' + this.currentInput;
        }
        this.updateDisplay();
    }

    insertPi() {
        this.currentInput = Math.PI.toString();
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    insertE() {
        this.currentInput = Math.E.toString();
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    showError(message = 'Fehler') {
        this.displayResult.classList.add('error');
        this.currentInput = message;
        this.updateDisplay();

        setTimeout(() => {
            this.displayResult.classList.remove('error');
            this.clear();
        }, 2000);
    }
}

// Initialisiere den Taschenrechner
const calculator = new Calculator();

// Tastatur-Support
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        calculator.appendNumber(event.key);
    } else if (event.key === '.') {
        calculator.appendNumber('.');
    } else if (event.key === '+') {
        calculator.appendOperator('+');
    } else if (event.key === '-') {
        calculator.appendOperator('-');
    } else if (event.key === '*') {
        calculator.appendOperator('*');
    } else if (event.key === '/') {
        event.preventDefault();
        calculator.appendOperator('/');
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculator.calculate();
    } else if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
        calculator.clear();
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        calculator.deleteLast();
    }
});
