
import React from 'react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme }) => {
  return (
    <div className={`p-8 text-white border-b transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-indigo-900 via-indigo-950 to-black border-slate-800' 
        : 'bg-gradient-to-br from-indigo-600 to-indigo-700 border-indigo-500/10'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight">SmartShop</h1>
            <span className={`text-[10px] uppercase tracking-tighter opacity-60 font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-100'}`}>
              Dev: Prasenjit
            </span>
          </div>
          <p className={`text-sm mt-1 font-medium transition-colors ${isDark ? 'text-indigo-400' : 'text-indigo-100'}`}>
            Intelligent list builder & marketing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleTheme}
            className={`p-3 rounded-2xl backdrop-blur-md border transition-all active:scale-95 ${
              isDark 
                ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20' 
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <div className={`p-3 rounded-2xl backdrop-blur-md border transition-all ${
            isDark 
              ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
              : 'bg-white/10 border-white/20 text-white'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
