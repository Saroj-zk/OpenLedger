import React, { useState } from 'react';
import { ArrowUp, Pencil, Lightbulb, Code, Search, Sparkles } from 'lucide-react';
import MorphingBar from './MorphingBar';

export default function HeroSection() {
  const [morphProgress, setMorphProgress] = useState(0);

  const suggestions = [
    { icon: <Pencil size={14} />, text: "Write content" },
    { icon: <Lightbulb size={14} />, text: "Brainstorm ideas" },
    { icon: <Sparkles size={14} className="text-brand-accent" />, text: "Join testnet", highlight: true },
    { icon: <Code size={14} />, text: "Write code" },
    { icon: <Search size={14} />, text: "Research a topic" },
  ];

  // Opacity for the hero content (Logo, Heading, Chips)
  // Reaches 0 opacity when morphProgress reaches 0.6 (60% movement)
  const contentOpacity = Math.max(0, 1 - (morphProgress / 0.6));

  return (
    <section className="relative min-h-screen flex flex-col pt-6 pb-8 px-6 text-foreground transition-colors duration-500 overflow-hidden bg-background">
      {/* Shader Background Removed */}

      {/* Top Header */}
      <header className="flex justify-between items-center w-full max-w-[1600px] mx-auto z-10">
        <div></div> {/* Empty div to keep the flex-between layout working for the right side buttons */}
        <div className="flex gap-4 items-center">
          <button className="px-5 py-2 rounded-full bg-white dark:bg-black/80 shadow-sm border border-border text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            Sign up
          </button>
        </div>
      </header>

      {/* Main Content Centered */}
      <main className="flex-1 flex flex-col items-center justify-center w-full z-40 -mt-16">

        {/* Everything above the chat bar fades out based on morphProgress */}
        <div
          className="flex flex-col items-center justify-center w-full"
          style={{
            opacity: contentOpacity,
            pointerEvents: contentOpacity < 0.5 ? 'none' : 'auto',
            transform: `translateY(${-morphProgress * 20}px)` // slight upward parallax
          }}
        >
          <h1
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-4xl md:text-[56px] text-gray-800 dark:text-gray-100 font-medium mb-10 drop-shadow-lg tracking-tight"
          >
            Think Freely...
          </h1>
        </div>

        {/* Morphing Input Bar */}
        <div className="w-full relative z-50">
          <MorphingBar onProgress={setMorphProgress} />
        </div>

        {/* Suggestion Chips */}
        <div
          className="flex flex-wrap justify-center gap-3 mt-6 relative z-10"
          style={{
            opacity: contentOpacity,
            pointerEvents: contentOpacity < 0.5 ? 'none' : 'auto',
            transform: `translateY(${morphProgress * 10}px)` // slight downward parallax
          }}
        >
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              className={`flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--chip-bg)] backdrop-blur-md shadow-sm border ${item.highlight ? 'border-brand-accent/40 bg-brand-accent/5 dark:bg-brand-accent/10' : 'border-border'} text-sm font-medium hover:bg-white/90 dark:hover:bg-white/20 transition-colors`}
            >
              <span className={item.highlight ? "text-brand-accent" : "text-gray-500 dark:text-gray-400"}>{item.icon}</span>
              <span className={item.highlight ? "text-brand-accent font-semibold" : "text-gray-700 dark:text-gray-200"}>{item.text}</span>
            </button>
          ))}
        </div>
      </main>

      {/* Footer Elements */}
      <footer
        className="w-full flex justify-center items-end z-10 px-2 pb-2"
        style={{
          opacity: contentOpacity,
          pointerEvents: contentOpacity < 0.5 ? 'none' : 'auto',
          transform: `translateY(${morphProgress * 10}px)` // slight downward parallax
        }}
      >
        <div className="flex flex-col items-center">
          {/* The apps live here because this is the last thing anyone
              reads before they scroll past the fold. */}
          <div className="mb-6 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">
              Also on
            </span>
            {['iOS', 'Android'].map((platform) => (
              <a
                key={platform}
                href="#"
                className="rounded-full border border-border bg-[var(--chip-bg)] px-3.5 py-1.5 text-[13px] font-medium text-gray-700 shadow-sm backdrop-blur-md transition-colors hover:bg-white/90 dark:text-gray-200 dark:hover:bg-white/20"
              >
                {platform}
              </a>
            ))}
          </div>

          <a href="#layer" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white flex flex-col items-center gap-1 transition-colors drop-shadow-md">
            Learn more about OpenLedger
            <ArrowUp size={16} className="rotate-180" />
          </a>
        </div>
      </footer>
    </section>
  );
}
