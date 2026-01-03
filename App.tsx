
import React, { useState, useEffect } from 'react';
import { ShoppingItem, AisleCategory } from './types';
import { categorizeItem, getSmartSuggestions } from './services/geminiService';
import ItemList from './components/ItemList';
import Header from './components/Header';
import SendPanel from './components/SendPanel';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  
  const [targetNumber, setTargetNumber] = useState(() => {
    return localStorage.getItem('target_number') || "897164272";
  });

  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [inputName, setInputName] = useState('');
  const [inputQty, setInputQty] = useState('1');
  const [isAdding, setIsAdding] = useState(false);
  const [suggestions, setSuggestions] = useState<{name: string, category: AisleCategory}[]>([]);

  // Persist theme and update body class
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.style.backgroundColor = isDark ? '#000000' : '#f8fafc';
  }, [isDark]);

  // Persist phone number
  useEffect(() => {
    localStorage.setItem('target_number', targetNumber);
  }, [targetNumber]);

  const handleAddItem = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputName.trim()) return;

    setIsAdding(true);
    // Categorization takes time as it calls Gemini API
    const category = await categorizeItem(inputName);
    
    const newItem: ShoppingItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: inputName.trim(),
      quantity: inputQty || '1',
      category,
      completed: false
    };

    setItems(prev => [...prev, newItem]);
    setInputName('');
    setInputQty('1');
    setIsAdding(false);
  };

  const handleQuickAdd = async (name: string, category: AisleCategory) => {
    const newItem: ShoppingItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      quantity: '1',
      category,
      completed: false
    };
    setItems(prev => [...prev, newItem]);
    setSuggestions(prev => prev.filter(s => s.name !== name));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const updateQuantity = (id: string, newQty: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  const clearCompleted = () => {
    setItems(prev => prev.filter(item => !item.completed));
  };

  useEffect(() => {
    if (items.length > 0 && items.length % 3 === 0) {
      const fetchSuggestions = async () => {
        const names = items.map(i => i.name);
        const newSuggestions = await getSmartSuggestions(names);
        setSuggestions(newSuggestions);
      };
      fetchSuggestions();
    }
  }, [items.length]);

  const completedCount = items.filter(i => i.completed).length;

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 md:p-8 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      <div className={`w-full max-w-2xl rounded-3xl overflow-hidden border transition-all duration-300 shadow-2xl ${
        isDark ? 'bg-slate-900 border-slate-800 shadow-indigo-900/10' : 'bg-white border-slate-100 shadow-slate-200'
      }`}>
        <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />

        {/* Input Area */}
        <div className={`p-6 border-b transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <form onSubmit={handleAddItem} className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder={isAdding ? "Categorizing item..." : "What are you buying?"}
                className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                } ${isAdding ? 'animate-pulse' : ''}`}
                disabled={isAdding}
              />
            </div>
            <div className="w-full sm:w-24">
              <input
                type="text"
                value={inputQty}
                onChange={(e) => setInputQty(e.target.value)}
                placeholder="Qty"
                className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
                disabled={isAdding}
              />
            </div>
            <button
              type="submit"
              disabled={isAdding || !inputName.trim()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 whitespace-nowrap"
            >
              {isAdding ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Item
                </>
              )}
            </button>
          </form>

          {isAdding && (
            <p className={`text-[10px] mt-2 font-medium animate-pulse flex items-center gap-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
              <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gemini AI is categorizing your item...
            </p>
          )}

          {/* AI Suggestions Chips */}
          {suggestions.length > 0 && (
            <div className="mt-4">
              <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Smart Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAdd(s.name, s.category)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors border flex items-center gap-1 ${
                      isDark 
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20' 
                        : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'
                    }`}
                  >
                    + {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* List Actions Section */}
        {items.length > 0 && (
          <div className={`px-6 py-3 border-b flex items-center justify-between transition-colors duration-300 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
            <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </span>
            {completedCount > 0 && (
              <button 
                onClick={clearCompleted}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Completed
              </button>
            )}
          </div>
        )}

        {/* List Content */}
        <div className="p-2 md:p-4 min-h-[300px]">
          <ItemList 
            isDark={isDark}
            items={items} 
            onDelete={removeItem} 
            onToggle={toggleItem} 
            onUpdateQty={updateQuantity}
          />
        </div>

        {/* Footer Sending Panel */}
        <SendPanel 
          isDark={isDark} 
          items={items} 
          targetNumber={targetNumber} 
          setTargetNumber={setTargetNumber}
        />
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-1">
        <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          {isDark ? 'Premium Dark Mode' : 'Clean Light Mode'} Active.
        </p>
        <p className={`text-[10px] uppercase tracking-widest font-bold opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>
          Developed by Prasenjit
        </p>
      </div>
    </div>
  );
};

export default App;
