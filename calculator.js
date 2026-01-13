class Calculator {
    constructor() {
        this.displayResult = document.getElementById('result');
        this.displayHistory = document.getElementById('history');
        this.displayMemory = document.getElementById('memoryDisplay');
        this.memoryIndicator = document.getElementById('memoryIndicator');
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.history = '';
        this.memory = 0;
        this.currentMode = 'basic';
        this.currentTheme = 'dark';

        // Load saved theme
        const savedTheme = localStorage.getItem('calculatorTheme') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            this.currentTheme = 'light';
        }
    }

    updateDisplay() {
        this.displayResult.textContent = this.currentInput;
        this.displayHistory.textContent = this.history;

        // Update memory display
        if (this.memory !== 0) {
            this.displayMemory.textContent = `Memory: ${this.formatResult(this.memory)}`;
            this.displayMemory.classList.add('active');
            this.memoryIndicator.classList.add('active');
        } else {
            this.displayMemory.textContent = '';
            this.displayMemory.classList.remove('active');
            this.memoryIndicator.classList.remove('active');
        }
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
            // Trigonometric functions
            case 'sin':
                result = Math.sin(this.degreesToRadians(current));
                funcDisplay = `sin(${current}°)`;
                break;
            case 'cos':
                result = Math.cos(this.degreesToRadians(current));
                funcDisplay = `cos(${current}°)`;
                break;
            case 'tan':
                result = Math.tan(this.degreesToRadians(current));
                funcDisplay = `tan(${current}°)`;
                break;

            // Inverse trigonometric functions
            case 'asin':
                if (current < -1 || current > 1) {
                    this.showError('Fehler: Wertebereich [-1, 1]');
                    return;
                }
                result = this.radiansToDegrees(Math.asin(current));
                funcDisplay = `sin⁻¹(${current})`;
                break;
            case 'acos':
                if (current < -1 || current > 1) {
                    this.showError('Fehler: Wertebereich [-1, 1]');
                    return;
                }
                result = this.radiansToDegrees(Math.acos(current));
                funcDisplay = `cos⁻¹(${current})`;
                break;
            case 'atan':
                result = this.radiansToDegrees(Math.atan(current));
                funcDisplay = `tan⁻¹(${current})`;
                break;

            // Hyperbolic functions
            case 'sinh':
                result = Math.sinh(current);
                funcDisplay = `sinh(${current})`;
                break;
            case 'cosh':
                result = Math.cosh(current);
                funcDisplay = `cosh(${current})`;
                break;

            // Power functions
            case 'square':
                result = Math.pow(current, 2);
                funcDisplay = `${current}²`;
                break;
            case 'cube':
                result = Math.pow(current, 3);
                funcDisplay = `${current}³`;
                break;

            // Root functions
            case 'sqrt':
                if (current < 0) {
                    this.showError('Fehler: Negative Wurzel');
                    return;
                }
                result = Math.sqrt(current);
                funcDisplay = `√(${current})`;
                break;
            case 'cbrt':
                result = Math.cbrt(current);
                funcDisplay = `∛(${current})`;
                break;

            // Logarithmic functions
            case 'log':
                if (current <= 0) {
                    this.showError('Fehler: Log von ≤ 0');
                    return;
                }
                result = Math.log10(current);
                funcDisplay = `log₁₀(${current})`;
                break;
            case 'ln':
                if (current <= 0) {
                    this.showError('Fehler: ln von ≤ 0');
                    return;
                }
                result = Math.log(current);
                funcDisplay = `ln(${current})`;
                break;

            // Exponential functions
            case 'exp':
                result = Math.exp(current);
                funcDisplay = `e^${current}`;
                break;
            case 'pow10':
                result = Math.pow(10, current);
                funcDisplay = `10^${current}`;
                break;

            // Other functions
            case 'factorial':
                if (current < 0 || !Number.isInteger(current)) {
                    this.showError('Fehler: Nur positive Ganzzahlen');
                    return;
                }
                if (current > 170) {
                    this.showError('Fehler: Zahl zu groß');
                    return;
                }
                result = this.factorial(current);
                funcDisplay = `${current}!`;
                break;
            case 'reciprocal':
                if (current === 0) {
                    this.showError('Fehler: Division durch 0');
                    return;
                }
                result = 1 / current;
                funcDisplay = `1/${current}`;
                break;
            case 'abs':
                result = Math.abs(current);
                funcDisplay = `|${current}|`;
                break;
            case 'percent':
                result = current / 100;
                funcDisplay = `${current}%`;
                break;
            case 'random':
                result = Math.random();
                funcDisplay = 'Random';
                break;
            default:
                return;
        }

        this.history = funcDisplay;
        this.currentInput = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    formatResult(number) {
        if (!isFinite(number)) {
            return 'Fehler';
        }

        // Round to 12 decimal places to avoid floating point errors
        const rounded = Math.round(number * 1e12) / 1e12;

        // Use scientific notation for very large or very small numbers
        if (Math.abs(rounded) > 1e10 || (Math.abs(rounded) < 1e-6 && rounded !== 0)) {
            return rounded.toExponential(8);
        }

        // Remove trailing zeros
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

    // Memory functions
    memoryClear() {
        this.memory = 0;
        this.updateDisplay();
    }

    memoryRecall() {
        if (this.memory !== 0) {
            this.currentInput = this.memory.toString();
            this.shouldResetDisplay = true;
            this.updateDisplay();
        }
    }

    memoryAdd() {
        const current = parseFloat(this.currentInput);
        if (!isNaN(current)) {
            this.memory += current;
            this.updateDisplay();
        }
    }

    memorySubtract() {
        const current = parseFloat(this.currentInput);
        if (!isNaN(current)) {
            this.memory -= current;
            this.updateDisplay();
        }
    }

    // Mode toggle
    setMode(mode) {
        this.currentMode = mode;

        const basicGrid = document.getElementById('basicGrid');
        const advancedGrid = document.getElementById('advancedGrid');
        const basicBtn = document.getElementById('basicMode');
        const advancedBtn = document.getElementById('advancedMode');

        if (mode === 'basic') {
            basicGrid.classList.remove('hidden');
            advancedGrid.classList.add('hidden');
            basicBtn.classList.add('active');
            advancedBtn.classList.remove('active');
        } else {
            basicGrid.classList.add('hidden');
            advancedGrid.classList.remove('hidden');
            basicBtn.classList.remove('active');
            advancedBtn.classList.add('active');
        }
    }

    // Theme toggle
    toggleTheme() {
        document.body.classList.toggle('light-theme');

        if (document.body.classList.contains('light-theme')) {
            this.currentTheme = 'light';
            localStorage.setItem('calculatorTheme', 'light');
        } else {
            this.currentTheme = 'dark';
            localStorage.setItem('calculatorTheme', 'dark');
        }
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

// Initialize calculator
const calculator = new Calculator();

// Keyboard support
document.addEventListener('keydown', (event) => {
    // Numbers
    if (event.key >= '0' && event.key <= '9') {
        calculator.appendNumber(event.key);
    }
    // Decimal point
    else if (event.key === '.') {
        calculator.appendNumber('.');
    }
    // Operators
    else if (event.key === '+') {
        calculator.appendOperator('+');
    }
    else if (event.key === '-') {
        calculator.appendOperator('-');
    }
    else if (event.key === '*') {
        calculator.appendOperator('*');
    }
    else if (event.key === '/') {
        event.preventDefault();
        calculator.appendOperator('/');
    }
    else if (event.key === '^') {
        calculator.appendOperator('^');
    }
    // Calculate
    else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculator.calculate();
    }
    // Clear
    else if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
        calculator.clear();
    }
    // Delete
    else if (event.key === 'Backspace') {
        event.preventDefault();
        calculator.deleteLast();
    }
    // Percent
    else if (event.key === '%') {
        calculator.calculateFunction('percent');
    }
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

console.log('%c🎨 Premium Calculator Loaded! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
console.log('%cFeatures: Dark/Light Theme, Basic/Advanced Mode, Memory Functions, 25+ Mathematical Operations', 'color: #667eea; font-size: 12px;');
