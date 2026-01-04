
import React from 'react';
import { ShoppingItem } from '../types';

interface ItemListProps {
  isDark: boolean;
  items: ShoppingItem[];
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdateQty: (id: string, qty: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ isDark, items, onDelete, onToggle, onUpdateQty }) => {
  if (items.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 transition-colors ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-lg font-medium">Your list is empty</p>
        <p className="text-sm">Ready for some shopping?</p>
      </div>
    );
  }

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  return (
    <div className="space-y-8">
      <style>
        {`
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .item-enter {
            animation: slideIn 0.3s ease-out forwards;
          }
        `}
      </style>
      {(Object.entries(groupedItems) as [string, ShoppingItem[]][]).sort().map(([category, catItems]) => (
        <div key={category} className="item-enter">
          <h3 className={`text-xs font-bold uppercase tracking-widest px-2 mb-3 flex items-center gap-2 transition-colors ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              category === 'Categorizing...' ? 'bg-amber-500 animate-pulse' : (isDark ? 'bg-indigo-600' : 'bg-indigo-400')
            }`}></span>
            {category}
          </h3>
          <div className="space-y-2">
            {catItems.map((item) => (
              <div 
                key={item.id} 
                className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  item.completed 
                    ? isDark 
                      ? 'border-slate-800 bg-slate-900/50 opacity-60' 
                      : 'border-slate-100 bg-slate-50/50 opacity-60'
                    : isDark
                      ? 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/60 shadow-lg shadow-black/20'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'
                } ${item.category === 'Categorizing...' ? 'border-dashed opacity-80' : ''}`}
              >
                <button 
                  onClick={() => onToggle(item.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    item.completed 
                      ? 'bg-indigo-600 border-indigo-600' 
                      : isDark ? 'border-slate-600 group-hover:border-indigo-500' : 'border-slate-300 group-hover:border-indigo-400'
                  }`}
                >
                  {item.completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className={`text-base font-semibold truncate transition-colors ${
                    item.completed 
                      ? isDark ? 'text-slate-500 line-through' : 'text-slate-300 line-through' 
                      : isDark ? 'text-slate-100' : 'text-slate-800'
                  }`}>
                    {item.name}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) => onUpdateQty(item.id, e.target.value)}
                    className={`w-12 text-center text-sm font-bold rounded-lg py-1 px-1 outline-none transition-colors border ${
                      isDark 
                        ? 'text-indigo-400 bg-slate-800 border-slate-700' 
                        : 'text-indigo-600 bg-indigo-50 border-indigo-100'
                    }`}
                  />
                  <button 
                    onClick={() => onDelete(item.id)}
                    className={`p-2 transition-colors opacity-0 group-hover:opacity-100 ${
                      isDark ? 'text-slate-600 hover:text-rose-500' : 'text-slate-300 hover:text-rose-400'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
