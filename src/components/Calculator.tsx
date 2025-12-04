import { useState, useEffect } from 'react';
import { X, Delete } from 'lucide-react';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const Calculator = ({ isOpen, onClose }: CalculatorProps) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset calculator when closed
      setDisplay('0');
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(false);
    }
  }, [isOpen]);

  // Keyboard support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDecimal();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        performOperation(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        performOperation('=');
      } else if (e.key === 'Escape') {
        clearAll();
      } else if (e.key === 'Backspace') {
        backspace();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, display, previousValue, operation, waitingForOperand]);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let newValue = currentValue;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '*':
          newValue = currentValue * inputValue;
          break;
        case '/':
          newValue = currentValue / inputValue;
          break;
        case '=':
          newValue = inputValue;
          break;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const percentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Calculator */}
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-neutral-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Calculadora
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-6 mb-6 border border-primary-200 dark:border-neutral-700">
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-neutral-400 mb-1 h-5">
              {previousValue !== null && operation && operation !== '=' && (
                <span>{previousValue} {operation}</span>
              )}
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white break-all">
              {display}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <button
            onClick={clearAll}
            className="col-span-2 bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300 rounded-xl py-4 font-semibold hover:bg-danger-200 dark:hover:bg-danger-900/50 transition-all active:scale-95"
          >
            AC
          </button>
          <button
            onClick={backspace}
            className="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-xl py-4 font-semibold hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all active:scale-95 flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={() => performOperation('/')}
            className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl py-4 text-2xl font-semibold hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-all active:scale-95"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            onClick={() => inputDigit('7')}
            className="bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-xl py-4 text-xl font-semibold hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all active:scale-95"
          >
            7
          </button>
          <button
            onClick={() => inputDigit('8')}
            className="bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-xl py-4 text-xl font-semibold hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all active:scale-95"
          >
            8
          </button>
          <button
            onClick={() => inputDigit('9')}
            className="bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-xl py-4 text-xl font-semibold hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all active:scale-95"
          >
            9
          </button>
          <button
            onClick={() => performOperation('*')}
            className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl py-4 text-2xl font-semibold hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-all active:scale-95"
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            onClick={() => inputDigit('4')}
            className="bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-xl py-4 text-xl font-semibold hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all active:scale-95"
          >
            4
          </button>
          <button
            onClick={() => inputDigit('5')}
            className="bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-xl py-4 text-xl font-semibold hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all active:scale-95"
          >
            5
          </button>
          <button
            onClick={() => inputDigit('6')}
            className="bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-xl py-4 text-xl font-semibold hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all active:scale-95"
          >
            6
          </button>
          <button
            onClick={() => performOperation('-')}
            className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl py-4 text-2xl font-semibold hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-all active:scale-95"
          >
            −
          </button>

          {/* Row 4 */}
          <button
            onClick={() => inputDigit('1')}
            className="bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-xl py-4 text-xl font-semibold hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all active:scale-95"
          >
            1
          </button>
          <button
            onClick={() => inputDigit('2')}
            className="bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-xl py-4 text-xl font-semibold hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all active:scale-95"
          >
            2
          </button>
          <button
            onClick={() => inputDigit('3')}
            className="bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-xl py-4 text-xl font-semibold hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all active:scale-95"
          >
            3
          </button>
          <button
            onClick={() => performOperation('+')}
            className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl py-4 text-2xl font-semibold hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-all active:scale-95"
          >
            +
          </button>

          {/* Row 5 */}
          <button
            onClick={toggleSign}
            className="bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-xl py-4 text-xl font-semibold hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all active:scale-95"
          >
            +/−
          </button>
          <button
            onClick={() => inputDigit('0')}
            className="bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-xl py-4 text-xl font-semibold hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all active:scale-95"
          >
            0
          </button>
          <button
            onClick={inputDecimal}
            className="bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-xl py-4 text-xl font-semibold hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all active:scale-95"
          >
            .
          </button>
          <button
            onClick={() => performOperation('=')}
            className="bg-success-600 dark:bg-success-500 text-white rounded-xl py-4 text-2xl font-semibold hover:bg-success-700 dark:hover:bg-success-600 transition-all active:scale-95"
          >
            =
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="mt-4 text-center text-xs text-gray-500 dark:text-neutral-500">
          Use o teclado: números, +, -, *, /, Enter, Esc
        </div>
      </div>
    </div>
  );
};

export default Calculator;
