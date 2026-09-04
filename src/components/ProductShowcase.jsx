import React, { useState } from 'react';
import { Bot, User, ChevronDown, Check, Settings, Mic, Paperclip, Send } from 'lucide-react';

export default function ProductShowcase() {
  const [selectedModel, setSelectedModel] = useState('GPT');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const models = ['GPT', 'Claude', 'Gemini', 'Grok', 'DeepSeek', 'Llama', 'Mistral'];

  return (
    <section id="product" className="py-32 px-4 relative bg-background transition-colors duration-300">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <span className="text-sm font-bold tracking-widest text-brand-accent uppercase mb-4 block">
          One Chat. Every Model.
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          Your AI, without the switching.
        </h2>
        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
          Access leading AI models from one private chat. Write with one. Reason with another. Switch whenever you want.
        </p>
        <p className="text-lg font-medium text-brand-accent">
          Your conversations and context move with you.
        </p>
      </div>

      <div className="max-w-4xl mx-auto relative group perspective">
        <div className="relative glass-panel rounded-2xl overflow-hidden flex flex-col md:flex-row h-[600px] transition-transform duration-700 hover:shadow-[0_0_80px_rgba(94,106,210,0.3)]">
          
          <div className="hidden md:flex flex-col w-64 border-r border-border bg-tertiary/50 p-4">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent to-brand-accent-hover flex items-center justify-center text-white">
                <span className="font-bold text-sm">OL</span>
              </div>
              <span className="font-semibold text-lg text-foreground">Nexus AI</span>
            </div>
            
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent Chats</div>
            <div className="space-y-1 flex-1 overflow-y-auto no-scrollbar">
              <div className="px-3 py-2 rounded-lg bg-black/5 dark:bg-white/10 text-sm font-medium text-foreground flex items-center gap-2">
                <span className="w-4 h-4 text-brand-accent"><Bot size={16}/></span>
                Project Ideas
              </div>
              <div className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors">
                <span className="w-4 h-4"><Bot size={16}/></span>
                Marketing Strategy
              </div>
              <div className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors">
                <span className="w-4 h-4"><Bot size={16}/></span>
                AI Research
              </div>
            </div>

            <button className="mt-4 w-full py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/20 transition-colors">
              + New Chat
            </button>
            
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300">
                <User size={16}/>
              </div>
              <span className="text-sm font-medium text-foreground">Alex R.</span>
              <Settings size={14} className="ml-auto text-gray-400"/>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative bg-card/30">
            <div className="h-14 border-b border-border flex items-center justify-center relative">
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-border text-sm font-medium transition-colors text-foreground"
                >
                  <Bot size={16} className="text-brand-accent" />
                  {selectedModel}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-tertiary border border-border rounded-xl shadow-2xl p-1 z-20">
                    <div className="text-xs font-medium text-gray-400 px-3 py-2 uppercase">Select Model</div>
                    {models.map(model => (
                      <button
                        key={model}
                        onClick={() => { setSelectedModel(model); setIsDropdownOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${selectedModel === model ? 'bg-brand-accent/10 text-brand-accent' : 'text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
                      >
                        {model}
                        {selectedModel === model && <Check size={14} className="text-brand-accent" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center flex-shrink-0 border border-border">
                  <Bot size={18} className="text-brand-accent"/>
                </div>
                <div className="bg-tertiary border border-border rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                  <p className="text-sm text-foreground leading-relaxed">
                    Hello! How can I assist you today? Feel free to ask about any topic.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 text-gray-600 dark:text-gray-300">
                  <User size={18}/>
                </div>
                <div className="bg-brand-accent text-white border border-brand-accent rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                  <p className="text-sm leading-relaxed">
                    Can you analyze the trends in AI development for 2024?
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center flex-shrink-0 border border-border">
                  <Bot size={18} className="text-brand-accent"/>
                </div>
                <div className="bg-tertiary border border-border rounded-2xl rounded-tl-none p-4 max-w-[80%] shadow-lg">
                  <p className="text-sm text-foreground mb-3 font-medium">
                    Certainly! Key trends for 2024 include:
                  </p>
                  <ol className="text-sm text-foreground space-y-2 list-decimal list-inside">
                    <li><strong>Multimodal Models:</strong> Processing image, audio, and video natively.</li>
                    <li><strong>Efficient SLMs:</strong> Small models for on-device applications.</li>
                    <li><strong>Agentic Workflows:</strong> AI systems acting autonomously.</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="bg-tertiary border border-cyan-500/30 rounded-2xl p-2 flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.1)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none"></div>
                <input 
                  type="text" 
                  disabled
                  placeholder={`Ask Nexus AI... (Using ${selectedModel})`}
                  className="flex-1 bg-transparent border-none text-sm px-3 text-foreground placeholder-gray-400 outline-none"
                />
                <button className="p-2 text-gray-400 hover:text-foreground transition-colors"><Mic size={18}/></button>
                <button className="p-2 text-gray-400 hover:text-foreground transition-colors"><Paperclip size={18}/></button>
                <button className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center hover:bg-cyan-400 transition-colors">
                  <Send size={14} className="ml-1"/>
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
