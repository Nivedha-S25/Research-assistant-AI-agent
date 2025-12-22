
import React, { useState, useRef, useEffect } from 'react';
import { Message, Sender } from '../types';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isThinking: boolean;
  contextLoaded: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  messages, 
  onSendMessage, 
  isThinking, 
  contextLoaded
}) => {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = () => {
    if (!inputValue.trim() || isThinking || !contextLoaded) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden h-full">
      {/* Dynamic Header */}
      <header className="h-20 border-b border-white/40 bg-white/60 backdrop-blur-xl px-10 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
             <div className={`w-3.5 h-3.5 rounded-full ${contextLoaded ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-slate-300'}`}></div>
             {contextLoaded && <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-30"></div>}
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">
              {contextLoaded ? 'Source Analysis Active' : 'Waiting for Source Document...'}
            </span>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest leading-none mt-1">
              Neural Processing Cluster
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-8 pb-32"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Initialization</h3>
            <p className="text-slate-600 max-w-sm mt-3 text-sm font-bold leading-relaxed">
              {contextLoaded 
                ? "Knowledge store ready. You can query specific details or ask for summaries." 
                : "Awaiting PDF ingestion. Use the sidebar to upload a research paper or report."}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
            >
              <div className={`max-w-[75%] rounded-[2rem] px-8 py-6 shadow-xl text-[15px] leading-relaxed relative
                ${msg.sender === Sender.USER 
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-tr-none shadow-indigo-500/20' 
                  : 'bg-white/95 text-slate-900 rounded-tl-none border border-white shadow-slate-200/50'}`}
              >
                <div className="font-medium whitespace-pre-wrap">
                  {msg.text}
                </div>
                <div className={`text-[10px] mt-4 font-black tracking-widest uppercase opacity-40 flex items-center gap-2 ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'}`}>
                  <span>{msg.sender === Sender.USER ? 'Investigator' : 'Research Agent'}</span>
                  <span>•</span>
                  <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))
        )}

        {isThinking && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-white/95 rounded-[2rem] rounded-tl-none px-8 py-6 shadow-xl border border-white">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">Synthesis Phase</span>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-8 left-0 right-0 px-10 pointer-events-none">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-3 shadow-2xl border border-white pointer-events-auto flex gap-3 items-end transition-all focus-within:ring-4 focus-within:ring-indigo-500/20">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!contextLoaded || isThinking}
              placeholder={contextLoaded ? "Enter analysis query..." : "Awaiting document injection..."}
              className="w-full bg-transparent border-none rounded-3xl px-6 py-4 text-[15px] font-bold placeholder:text-slate-400 focus:ring-0 outline-none transition-all resize-none min-h-[56px] max-h-48 disabled:opacity-50 text-slate-900"
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isThinking || !contextLoaded}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-200 disabled:to-slate-300 disabled:shadow-none text-white w-14 h-14 rounded-[1.8rem] font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center shrink-0 active:scale-90 group"
          >
            {isThinking ? (
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg className="w-6 h-6 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ChatArea;
