import React, { useState, useEffect } from 'react';
import { Key, ArrowUp, ChevronDown } from 'lucide-react';

export default function Navbar({ theme, toggleTheme }) {
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar when scrolled past the hero section's input (approx 300px)
      if (window.scrollY > 250) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-4 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <nav className="w-full max-w-6xl mx-4 bg-white dark:bg-[#1A1C20] rounded-full px-6 py-2 shadow-lg border border-gray-100 dark:border-white/10 flex items-center justify-between transition-colors">
        
        {/* Left side: Logo and Search */}
        <div className="flex items-center gap-4">
          <Key size={24} strokeWidth={1.5} className="rotate-45 text-gray-800 dark:text-gray-200" />
          
          <div className="w-64 bg-gray-50 dark:bg-black/20 rounded-full p-1.5 flex items-center border border-gray-100 dark:border-white/5">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-white placeholder-gray-400 text-[13px] px-3"
            />
            <button className="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-300 flex items-center justify-center">
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
        
        {/* Center: Nav Links */}
        <div className="hidden lg:flex items-center gap-6">
          <a href="#about" className="text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">About</a>
          <a href="#features" className="text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Features</a>
          <a href="#token" className="text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors">
            Token <ChevronDown size={14} />
          </a>
          <a href="#pricing" className="text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Pricing</a>
          <a href="#resources" className="text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors">
            Resources <ChevronDown size={14} />
          </a>
          <a href="#store" className="text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Store</a>
        </div>
        
        {/* Right side: Login */}
        <div className="flex items-center gap-4">
          <button className="text-[14px] font-semibold text-gray-800 dark:text-gray-100 hover:opacity-80 transition-opacity">
            Log in
          </button>
        </div>
      </nav>
    </div>
  );
}
