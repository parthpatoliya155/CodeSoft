class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === '0' || this.currentOperand === 'Error') return;
        if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
            this.currentOperand = '0';
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (this.currentOperand === 'Error') this.currentOperand = '0';
        if (this.shouldResetScreen) {
            this.currentOperand = number.toString();
            this.shouldResetScreen = false;
            return;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === 'Error') return;
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        let opSymbol = '';
        switch(operation) {
            case 'add': opSymbol = '+'; break;
            case 'subtract': opSymbol = '−'; break;
            case 'multiply': opSymbol = '×'; break;
            case 'divide': opSymbol = '÷'; break;
        }
        
        this.operation = opSymbol;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.operation = undefined;
                    this.previousOperand = '';
                    this.shouldResetScreen = true;
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Handle floating point precision to avoid e.g. 0.1 + 0.2 = 0.30000000000000004
        computation = Math.round(computation * 10000000000) / 10000000000;
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    applyPercent() {
        if (this.currentOperand === '0' || this.currentOperand === 'Error') return;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
    }

    negate() {
        if (this.currentOperand === '0' || this.currentOperand === 'Error') return;
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.slice(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
    }

    getDisplayNumber(number) {
        if (number === 'Error') return number;
        if (number === '-') return '-';
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        const cursorHTML = '<span class="cursor">|</span>';
        
        this.currentOperandElement.innerHTML = this.getDisplayNumber(this.currentOperand) + cursorHTML;
        
        if (this.operation != null) {
            this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }

        // Adjust font size based on length
        const displayLength = this.currentOperand.length;
        if (displayLength > 11) {
            this.currentOperandElement.style.fontSize = '2.2rem';
        } else if (displayLength > 8) {
            this.currentOperandElement.style.fontSize = '2.8rem';
        } else {
            this.currentOperandElement.style.fontSize = '3.8rem';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.querySelector('.previous-operand');
    const currentOperandElement = document.querySelector('.current-operand');
    const calculator = new Calculator(previousOperandElement, currentOperandElement);

    // Initial display update
    calculator.updateDisplay();

    const buttons = document.querySelectorAll('.btn');
    
    // Add click event listeners
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('number')) {
                calculator.appendNumber(button.dataset.number);
            } else if (button.classList.contains('operator') && !button.classList.contains('calculate')) {
                calculator.chooseOperation(button.dataset.action);
            } else if (button.dataset.action === 'calculate') {
                calculator.compute();
            } else if (button.dataset.action === 'clear') {
                calculator.clear();
            } else if (button.dataset.action === 'delete') {
                calculator.delete();
            } else if (button.dataset.action === 'percent') {
                calculator.applyPercent();
            } else if (button.dataset.action === 'negate') {
                calculator.negate();
            }
            calculator.updateDisplay();
        });
    });

    // Theme Toggle
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const body = document.body;
    const themeIcon = themeToggleBtn.querySelector('i');

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('light-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    // Keyboard Support
    document.addEventListener('keydown', e => {
        let actionTriggered = false;

        if (e.key >= '0' && e.key <= '9') {
            calculator.appendNumber(e.key);
            triggerButtonAnimation(`[data-number="${e.key}"]`);
            actionTriggered = true;
        }
        else if (e.key === '.') {
            calculator.appendNumber('.');
            triggerButtonAnimation(`[data-number="."]`);
            actionTriggered = true;
        }
        else if (e.key === '=' || e.key === 'Enter') {
            e.preventDefault();
            calculator.compute();
            triggerButtonAnimation(`[data-action="calculate"]`);
            actionTriggered = true;
        }
        else if (e.key === 'Backspace') {
            calculator.delete();
            triggerButtonAnimation(`[data-action="delete"]`);
            actionTriggered = true;
        }
        else if (e.key === 'Escape') {
            calculator.clear();
            triggerButtonAnimation(`[data-action="clear"]`);
            actionTriggered = true;
        }
        else if (e.key === '+') {
            calculator.chooseOperation('add');
            triggerButtonAnimation(`[data-action="add"]`);
            actionTriggered = true;
        }
        else if (e.key === '-') {
            calculator.chooseOperation('subtract');
            triggerButtonAnimation(`[data-action="subtract"]`);
            actionTriggered = true;
        }
        else if (e.key === '*' || e.key === 'x') {
            calculator.chooseOperation('multiply');
            triggerButtonAnimation(`[data-action="multiply"]`);
            actionTriggered = true;
        }
        else if (e.key === '/') {
            e.preventDefault(); // Prevent search finding in some browsers
            calculator.chooseOperation('divide');
            triggerButtonAnimation(`[data-action="divide"]`);
            actionTriggered = true;
        }
        else if (e.key === '%') {
            calculator.applyPercent();
            triggerButtonAnimation(`[data-action="percent"]`);
            actionTriggered = true;
        }

        if (actionTriggered) {
            calculator.updateDisplay();
        }
    });

    // Helper for keyboard animation
    function triggerButtonAnimation(selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.classList.add('pressed');
            setTimeout(() => {
                button.classList.remove('pressed');
            }, 100);
        }
    }
});
