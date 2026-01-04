
import React, { useState } from 'react';
import { ShoppingItem } from '../types';
import { jsPDF } from 'https://esm.sh/jspdf';

interface SendPanelProps {
  isDark: boolean;
  items: ShoppingItem[];
  targetNumber: string;
  setTargetNumber: (num: string) => void;
}

const SendPanel: React.FC<SendPanelProps> = ({ isDark, items, targetNumber, setTargetNumber }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const formatListText = () => {
    if (items.length === 0) return "My shopping list is currently empty.";
    
    let text = "🛒 *My SmartShop List:*\n\n";
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);

    (Object.entries(grouped) as [string, ShoppingItem[]][]).forEach(([cat, catItems]) => {
      text += `*${cat.toUpperCase()}*\n`;
      catItems.forEach(item => {
        text += `${item.completed ? '✅' : '⬜'} ${item.name} (${item.quantity})\n`;
      });
      text += '\n';
    });

    return text;
  };

  const handleSendSMS = () => {
    const text = encodeURIComponent(formatListText());
    window.open(`sms:${targetNumber}?body=${text}`, '_self');
  };

  const generatePDF = async () => {
    if (items.length === 0) return;
    setIsGeneratingPdf(true);
    
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();
      
      doc.setFontSize(22);
      doc.setTextColor(79, 70, 229); 
      doc.text("SmartShop List", 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated on: ${timestamp}`, 20, 28);
      
      let y = 40;
      const grouped = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, ShoppingItem[]>);

      (Object.entries(grouped) as [string, ShoppingItem[]][]).forEach(([category, catItems]) => {
        if (y > 270) { doc.addPage(); y = 20; }
        
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.setFont("helvetica", "bold");
        doc.text(category.toUpperCase(), 20, y);
        y += 8;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        catItems.forEach(item => {
          if (y > 280) { doc.addPage(); y = 20; }
          const status = item.completed ? "[X]" : "[ ]";
          doc.text(`${status} ${item.name} (${item.quantity})`, 25, y);
          y += 6;
        });
        y += 6;
      });

      doc.save(`SmartShop_List_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className={`p-6 border-t transition-colors duration-300 flex flex-col gap-6 ${
      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'
    }`}>
      
      <div className="flex flex-col gap-2">
        <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Target Phone Number
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">+</span>
          <input
            type="tel"
            value={targetNumber}
            onChange={(e) => setTargetNumber(e.target.value)}
            placeholder="e.g. 897164272"
            className={`w-full pl-8 pr-4 py-3 text-base rounded-xl border transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-700' 
                : 'bg-white border-slate-200 text-slate-800 placeholder-slate-300'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleSendSMS}
          disabled={items.length === 0}
          className="px-5 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg disabled:opacity-30 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Send SMS
        </button>

        <button
          onClick={generatePDF}
          disabled={items.length === 0 || isGeneratingPdf}
          className={`px-5 py-4 rounded-xl border font-bold transition-all flex items-center justify-center gap-2 ${
            isDark 
              ? 'border-indigo-900 bg-indigo-900/20 text-indigo-400 hover:bg-indigo-900/40' 
              : 'border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
          } disabled:opacity-30`}
        >
          {isGeneratingPdf ? (
            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          )}
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default SendPanel;
