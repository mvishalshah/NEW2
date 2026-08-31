import React, { useState, useEffect, useRef } from 'react';
import { Calculator, X, Equal, Delete } from 'lucide-react';

export const FloatingCalculator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !dragRef.current) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const dx = clientX - dragRef.current.startX;
      const dy = clientY - dragRef.current.startY;
      
      let newX = dragRef.current.initialX + dx;
      let newY = dragRef.current.initialY + dy;
      
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;
      
      newX = Math.max(10, Math.min(newX, maxX));
      newY = Math.max(10, Math.min(newY, maxY));
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: position.x,
      initialY: position.y
    };
    setIsDragging(true);
  };

  const calculateResult = (eq: string): string => {
    try {
      const sanitized = eq.replace(/[^-()\d/*+.]/g, '');
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + sanitized)();
      if (!isFinite(result)) return 'Error';
      return String(Math.round(result * 100) / 100);
    } catch {
      return 'Error';
    }
  };

  const handleKeyPress = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
      setEquation('');
      setIsNewNumber(true);
      return;
    }
    
    if (val === 'DEL') {
      if (display.length > 1) {
        setDisplay(display.slice(0, -1));
      } else {
        setDisplay('0');
        setIsNewNumber(true);
      }
      return;
    }
    
    if (val === '=') {
      if (!equation && !isNewNumber) return;
      const fullEq = equation + display;
      const res = calculateResult(fullEq);
      setDisplay(res);
      setEquation('');
      setIsNewNumber(true);
      return;
    }

    if (['+', '-', '*', '/'].includes(val)) {
      if (equation && !isNewNumber) {
        const res = calculateResult(equation + display);
        setDisplay(res);
        setEquation(res + val);
      } else {
        setEquation(display + val);
      }
      setIsNewNumber(true);
      return;
    }

    if (isNewNumber) {
      if (val === '.') {
        setDisplay('0.');
      } else {
        setDisplay(val);
      }
      setIsNewNumber(false);
    } else {
      if (val === '.' && display.includes('.')) return;
      setDisplay(display + val);
    }
  };

  const buttons = [
    'C', 'DEL', '/', '*',
    '7', '8', '9', '-',
    '4', '5', '6', '+',
    '1', '2', '3', '=',
    '0', '.'
  ];

  return (
    <div 
      className="fixed z-[200]" 
      style={{ 
        left: position.x, 
        top: position.y,
        transform: isOpen ? 'translate(-100%, -100%)' : 'none'
      }}
    >
      {!isOpen ? (
        <button
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onClick={(e) => {
            if (!isDragging) setIsOpen(true);
          }}
          className="w-14 h-14 rounded-full bg-indigo-600 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center hover:bg-indigo-700 transition-colors cursor-grab active:cursor-grabbing border-2 border-white/20"
          title="Open Calculator"
        >
          <Calculator className="w-6 h-6" />
        </button>
      ) : (
        <div className="w-64 bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div 
            className="w-full bg-slate-800/80 p-3 flex justify-between items-center cursor-grab active:cursor-grabbing border-b border-slate-700"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <div className="flex items-center gap-2 text-white font-semibold text-xs px-1">
              <Calculator className="w-4 h-4" />
              Calculator
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 bg-slate-900 flex flex-col items-end justify-end h-24 border-b border-slate-800">
            <div className="text-slate-400 text-xs h-4 mb-1 tracking-wider">{equation}</div>
            <div className="text-white text-3xl font-light tracking-tight truncate w-full text-right">{display}</div>
          </div>
          
          <div className="p-3 grid grid-cols-4 gap-2 bg-slate-950">
            {buttons.map((btn, i) => {
              const isOp = ['/', '*', '-', '+'].includes(btn);
              const isEq = btn === '=';
              const isAction = ['C', 'DEL'].includes(btn);
              
              let bgClass = "bg-slate-800 hover:bg-slate-700 text-white";
              if (isOp) bgClass = "bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30";
              if (isEq) bgClass = "bg-indigo-600 text-white hover:bg-indigo-500";
              if (isAction) bgClass = "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20";
              
              if (isEq) {
                  return (
                    <button
                        key={i}
                        onClick={() => handleKeyPress(btn)}
                        className={`col-start-4 row-start-4 row-span-2 rounded-2xl flex items-center justify-center font-medium text-sm transition-colors active:scale-95 ${bgClass}`}
                    >
                        <Equal className="w-5 h-5" />
                    </button>
                  );
              }
              
              if (btn === '0') {
                  return (
                    <button
                        key={i}
                        onClick={() => handleKeyPress(btn)}
                        className={`col-span-2 rounded-2xl h-12 flex items-center justify-center font-medium text-sm transition-colors active:scale-95 ${bgClass}`}
                    >
                        {btn}
                    </button>
                  );
              }
              
              if (btn === 'DEL') {
                  return (
                    <button
                        key={i}
                        onClick={() => handleKeyPress(btn)}
                        className={`rounded-2xl h-12 flex items-center justify-center font-medium text-sm transition-colors active:scale-95 ${bgClass}`}
                    >
                        <Delete className="w-4 h-4" />
                    </button>
                  );
              }

              return (
                <button
                  key={i}
                  onClick={() => handleKeyPress(btn)}
                  className={`rounded-2xl h-12 flex items-center justify-center font-medium text-sm transition-colors active:scale-95 ${bgClass}`}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
