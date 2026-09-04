import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Paperclip } from 'lucide-react';
import { Link } from '../router';

/* The bar carries the site's only navigation, so it points at the
   sections that actually exist. */
const NAV = [
  { label: 'Models', to: '/models' },
  { label: 'Council', href: '#council' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'API', href: '#api' },
  { label: 'Enterprise', href: '#enterprise' },
];

const navLinkClass =
  'text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors';

export default function MorphingBar({ onProgress }) {
  const [isStuck, setIsStuck] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const placeholderRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect();
        
        // It is stuck if the placeholder reaches 16px from the top of the viewport
        const currentlyStuck = rect.top <= 16;
        setIsStuck(currentlyStuck);
        
        // Dynamically calculate the absolute top of the element in the document.
        // Doing this on every scroll makes it completely immune to layout shifts!
        const absoluteTop = rect.top + window.scrollY;
        
        let currentProgress = 0;
        if (absoluteTop > 16) {
          currentProgress = Math.min(1, Math.max(0, window.scrollY / (absoluteTop - 16)));
        }
        
        setProgress(currentProgress);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Report progress to parent container
  useEffect(() => {
    if (onProgress) onProgress(progress);
  }, [progress, onProgress]);

  // Elongation begins at 50% of the movement
  const elongateProgress = Math.min(1, Math.max(0, (progress - 0.5) / 0.5));

  // Fade progress begins exactly at 70% of the movement
  const fadeProgress = Math.min(1, Math.max(0, (progress - 0.7) / 0.3));

  // Derived style values
  const barMaxWidth = 768 + elongateProgress * (1152 - 768); 
  
  return (
    <div ref={placeholderRef} className="w-full max-w-3xl mx-auto h-[58px] relative z-50">
      
      {/* 
        The bar sits absolute inside the placeholder until it hits the top.
        This guarantees perfect scrolling without JS lag/collision!
      */}
      <div 
        className={`w-[calc(100vw-2rem)] will-change-transform ${
          isStuck 
            ? 'fixed top-4 left-1/2 -translate-x-1/2 z-50' 
            : 'absolute top-0 left-1/2 -translate-x-1/2'
        }`}
        style={{ maxWidth: `${barMaxWidth}px` }}
      >
        <div 
          className="relative bg-white dark:bg-[#1A1C20] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-white/10 overflow-hidden h-[58px]"
        >
          {/* =========================================
              OLD CONTENT: Centered Hero Chat Bar 
          ========================================= */}
          <div 
            className="absolute inset-0 flex items-center w-full p-2"
            style={{ 
              opacity: 1 - fadeProgress, 
              pointerEvents: fadeProgress > 0.5 ? 'none' : 'auto',
              filter: `blur(${fadeProgress * 4}px)`,
              // Very subtle scale so the edges don't detach completely during fade
              transform: `scale(${1 - fadeProgress * 0.02})` 
            }}
          >
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors w-12 flex items-center justify-center flex-shrink-0">
              <Paperclip size={20} />
            </button>
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything privately..."
              className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-white placeholder-gray-400 text-[17px] px-1"
            />
            
            <button 
              className={`w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-full transition-colors ml-2 ${
                inputValue.trim() ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 text-gray-400 dark:bg-white/10'
              }`}
            >
              <ArrowUp size={20} />
            </button>
          </div>

          {/* =========================================
              NEW CONTENT: Navbar Layout
          ========================================= */}
          <div 
            className="absolute inset-0 flex items-center justify-between px-6 py-2"
            style={{ 
              opacity: fadeProgress, 
              pointerEvents: fadeProgress > 0.5 ? 'auto' : 'none',
              filter: `blur(${(1 - fadeProgress) * 4}px)`,
              transform: `scale(${0.95 + fadeProgress * 0.05})`
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-64 bg-gray-50 dark:bg-white/5 rounded-full p-1.5 flex items-center border border-gray-100 dark:border-white/5">
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
            
            <div className="flex items-center gap-4 whitespace-nowrap">
              <div className="hidden lg:flex items-center gap-6">
                {NAV.map((item) =>
                  item.to ? (
                    <Link key={item.label} to={item.to} className={navLinkClass}>
                      {item.label}
                    </Link>
                  ) : (
                    <a key={item.label} href={item.href} className={navLinkClass}>
                      {item.label}
                    </a>
                  ),
                )}
              </div>
              
              <Link
                to="/token"
                className="hidden sm:inline-flex items-center rounded-full border border-brand-accent/40 px-3.5 py-1.5 text-[13px] font-semibold text-accent transition-colors hover:bg-brand-accent hover:border-brand-accent hover:text-white"
              >
                $OPEN
              </Link>

              <button className="text-[14px] font-semibold text-gray-800 dark:text-gray-100 hover:opacity-80 transition-opacity">
                Log in
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
