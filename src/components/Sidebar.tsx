
import React, { useRef } from 'react';

interface SidebarProps {
  onFileUpload: (file: File) => void;
  onNewChat: () => void;
  currentFileName: string | null;
  isProcessing: boolean;
  onToggleContext: () => void;
  contextLoaded: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  onFileUpload,
  onNewChat,
  currentFileName,
  isProcessing,
  onToggleContext,
  contextLoaded
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <aside className="w-80 h-full bg-white/60 backdrop-blur-2xl border-r border-white/40 flex flex-col p-6 shadow-2xl z-20">
      {/* Branded Header Box */}
      <div className="mb-8 p-4 bg-gradient-to-br from-white to-slate-50 rounded-[2rem] border border-white shadow-xl shadow-indigo-500/5 ring-1 ring-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
            </svg>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight truncate">
              Research Agent
            </h1>
            <p className="text-[9px] uppercase tracking-[0.15em] font-black text-indigo-500/80 leading-none mt-1">
              Contextual Engine
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-sm font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 active:scale-95 border border-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Start New Thread
        </button>

        {/* File Upload Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Source Material</label>
            {currentFileName && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">ACTIVE</span>}
          </div>
          
          <div 
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`group relative overflow-hidden bg-white/80 backdrop-blur-md rounded-2xl p-5 transition-all cursor-pointer border-2 border-dashed
              ${currentFileName ? 'border-indigo-300 bg-indigo-50/80 shadow-inner' : 'border-slate-300 hover:border-indigo-400 hover:bg-white'}
              ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'shadow-sm'}`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf" 
              className="hidden" 
            />
            
            {isProcessing ? (
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-8 h-8 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="text-[11px] text-indigo-700 font-bold">Analyzing...</span>
              </div>
            ) : currentFileName ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A1 1 0 0111.293 2.707l5 5a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-center overflow-hidden w-full">
                  <p className="text-[11px] font-bold text-slate-900 truncate px-2">{currentFileName}</p>
                  <p className="text-[9px] text-indigo-600 font-bold uppercase mt-1">Change Document</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-2 group-hover:scale-105 transition-transform">
                <div className="w-10 h-10 bg-slate-100 group-hover:bg-indigo-50 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-indigo-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-800">Inject Knowledge</p>
                  <p className="text-[10px] text-slate-500 font-medium">Click to upload PDF</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Source Button */}
        {contextLoaded && (
          <button
            onClick={onToggleContext}
            className="w-full py-3 px-4 bg-white/80 hover:bg-white text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-200 shadow-sm flex items-center justify-center gap-2 active:scale-95"
          >
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Extracted Context
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
