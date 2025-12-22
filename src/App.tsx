
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { extractTextFromPDF } from './services/pdfService';
import { askGemini } from './services/geminiService';
import { Message, Sender, SessionData } from './types';

const getInitialState = (): SessionData => ({
  messages: [],
  context: '',
  currentFileName: null,
});

const App: React.FC = () => {
  const [session, setSession] = useState<SessionData>(getInitialState());
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showContext, setShowContext] = useState(false);

  // Handle PDF Upload
  const handleFileUpload = async (file: File) => {
    setIsProcessingPdf(true);
    try {
      const text = await extractTextFromPDF(file);
      setSession(prev => ({
        ...prev,
        context: text,
        currentFileName: file.name,
        messages: [
          {
            id: Date.now().toString(),
            sender: Sender.AI,
            text: `Document analysis initialized for "${file.name}". I've ingested ${text.length} characters of context. You may begin your inquiry.`,
            timestamp: new Date()
          }
        ]
      }));
    } catch (err: any) {
      alert(err.message || "Failed to process the document.");
    } finally {
      setIsProcessingPdf(false);
    }
  };

  // Handle Sending Messages
  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: Sender.USER,
      text,
      timestamp: new Date()
    };

    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
    }));
    
    setIsThinking(true);

    try {
      const chatHistory = session.messages.map(m => ({
        role: m.sender === Sender.USER ? 'user' as const : 'model' as const,
        parts: [{ text: m.text }]
      }));

      const aiResponse = await askGemini(text, session.context, chatHistory);
      
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: Sender.AI,
        text: aiResponse,
        timestamp: new Date()
      };

      setSession(prev => ({
        ...prev,
        messages: [...prev.messages, aiMsg]
      }));
    } catch (err: any) {
      const errMsg: Message = {
        id: `error-${Date.now()}`,
        sender: Sender.AI,
        text: `Error: ${err.message}. Ensure your environment is properly configured.`,
        timestamp: new Date()
      };
      setSession(prev => ({ ...prev, messages: [...prev.messages, errMsg] }));
    } finally {
      setIsThinking(false);
    }
  };

  const handleNewChat = () => {
    setSession(prev => ({
      ...prev,
      messages: prev.currentFileName ? [{
        id: Date.now().toString(),
        sender: Sender.AI,
        text: `Refreshed analysis session for "${prev.currentFileName}". Past context is retained.`,
        timestamp: new Date()
      }] : [],
    }));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden relative">
      <Sidebar 
        onFileUpload={handleFileUpload}
        onNewChat={handleNewChat}
        currentFileName={session.currentFileName}
        isProcessing={isProcessingPdf}
        onToggleContext={() => setShowContext(!showContext)}
        contextLoaded={!!session.context}
      />
      <ChatArea 
        messages={session.messages}
        onSendMessage={handleSendMessage}
        isThinking={isThinking}
        contextLoaded={!!session.context}
      />

      {/* Context Overlay Modal */}
      {showContext && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-10 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl h-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Source Context Explorer</h2>
                <p className="text-sm text-indigo-600 font-bold uppercase tracking-widest mt-1">{session.currentFileName}</p>
              </div>
              <button 
                onClick={() => setShowContext(false)}
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-all text-slate-500 shadow-sm border border-slate-200/50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50 custom-scrollbar">
              <div className="max-w-3xl mx-auto">
                <pre className="text-[15px] text-slate-700 font-medium whitespace-pre-wrap leading-relaxed font-sans">
                  {session.context || "No context data available."}
                </pre>
              </div>
            </div>
            <div className="p-6 bg-white border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">EndOfKnowledgeExtraction</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
