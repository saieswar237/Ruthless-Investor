
import React, { useState, useRef, useEffect } from 'react';
import { Send, Download, ChevronRight, Loader2, Info, ExternalLink, MessageCircle } from 'lucide-react';
import { StartupEvaluation, EvaluationStatus, Message } from '../types';
import ReportCard from './ReportCard';

interface ChatInterfaceProps {
  evaluation: StartupEvaluation | null;
  status: EvaluationStatus;
  onSubmit: (idea: string) => void;
  onChat: (question: string) => void;
  onDownload: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ evaluation, status, onSubmit, onChat, onDownload }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    if (evaluation) {
      onChat(input);
    } else {
      onSubmit(input);
    }
    setInput('');
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [evaluation?.chatHistory, status]);

  return (
    <div className="flex-1 flex flex-col bg-[#050505] relative h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-4xl mx-auto space-y-12 pb-48">
          {!evaluation && status === EvaluationStatus.IDLE && (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="relative">
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 uppercase tracking-tighter italic select-none">
                  RUTHLESS
                </h1>
                <div className="absolute -bottom-4 right-0 bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase italic tracking-[0.3em]">
                  Investor
                </div>
              </div>
              <p className="text-gray-500 max-w-sm text-sm uppercase font-bold tracking-widest leading-relaxed">
                The architect of your startup's destruction or its only chance at survival.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {['Hyper-local Groceries', 'AI-Tutor for Dogs', 'On-demand Laundry'].map(ex => (
                  <button 
                    key={ex}
                    onClick={() => setInput(ex)}
                    className="bg-red-950/10 hover:bg-red-950/30 border border-red-900/30 px-6 py-2 rounded-none text-[10px] font-black text-red-700 uppercase tracking-widest transition-all hover:text-red-500"
                  >
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {status === EvaluationStatus.LOADING && (
            <div className="flex flex-col items-center justify-center space-y-6 py-32">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-red-900/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-red-700 text-xs font-black uppercase tracking-[0.4em] animate-pulse">Running competitive intelligence...</p>
            </div>
          )}

          {evaluation && (
            <div className="space-y-12 animate-in fade-in duration-500">
              {/* Main Evaluation Report */}
              <div className="space-y-8">
                <div className="flex items-end justify-between border-b border-red-900/30 pb-4">
                  <div>
                    <div className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-1">Subject Analysis</div>
                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                      {evaluation.idea}
                    </h2>
                  </div>
                  <button
                    onClick={onDownload}
                    className="flex items-center gap-2 bg-red-950/20 hover:bg-red-600 text-[10px] font-black px-4 py-2 text-red-500 hover:text-white transition-all border border-red-900 uppercase tracking-widest"
                  >
                    <Download size={12} />
                    Report.PDF
                  </button>
                </div>
                
                <ReportCard data={evaluation.reportCard} />

                {/* Grounding Sources */}
                {evaluation.sources && evaluation.sources.length > 0 && (
                  <div className="bg-red-950/5 border border-red-900/20 p-4 rounded-none">
                    <div className="text-[9px] font-black text-red-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <ExternalLink size={10} /> Real-World Market References
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {evaluation.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] font-bold text-gray-500 hover:text-red-500 flex items-center gap-1 bg-white/5 px-2 py-1 transition-colors"
                        >
                          {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-[#0a0a0a] border-l-4 border-red-600 p-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-2 opacity-5 text-red-600 rotate-12 group-hover:rotate-0 transition-transform">
                     <Info size={120} />
                   </div>
                   <div className="relative z-10 prose prose-invert max-w-none text-gray-400 font-medium leading-loose space-y-6 text-sm">
                     {evaluation.analysis.split('\n\n').map((para, i) => (
                       <p key={i} className="last:mb-0 first-letter:text-2xl first-letter:font-black first-letter:text-red-600 first-letter:mr-1">{para}</p>
                     ))}
                   </div>
                </div>

                {/* Follow-up Chat UI */}
                <div className="space-y-6 pt-12 border-t border-red-900/10">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                    <MessageCircle size={14} /> Intelligence Interrogation
                  </div>
                  
                  {evaluation.chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-none text-sm ${
                        msg.role === 'user' 
                          ? 'bg-red-950/20 border border-red-900/30 text-red-400 font-bold' 
                          : 'bg-[#111] text-gray-400 font-medium border-l border-red-600'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  
                  {status === EvaluationStatus.CHATTING && (
                    <div className="flex justify-start">
                      <div className="bg-[#111] border-l border-red-600 p-4 text-gray-600 italic text-xs animate-pulse">
                        The architect is considering your defense...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-12 bg-gradient-to-t from-black via-black to-transparent">
        <div className="max-w-3xl mx-auto relative">
          <div className="bg-[#0c0c0c] border border-red-900/30 rounded-none shadow-2xl focus-within:border-red-600 transition-all overflow-hidden">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={evaluation ? "Ask a follow-up question or defend your idea..." : "Pitch your idea for evaluation..."}
              className="w-full bg-transparent text-white px-6 py-5 focus:outline-none resize-none min-h-[64px] text-sm font-medium leading-relaxed placeholder:text-gray-700"
            />
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="text-[9px] text-red-900 font-black uppercase tracking-[0.4em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                Savage AI Active • Grounding On
              </div>
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || status === EvaluationStatus.LOADING || status === EvaluationStatus.CHATTING}
                className={`flex items-center gap-2 px-6 py-2 rounded-none transition-all text-[10px] font-black uppercase tracking-[0.2em] ${
                  input.trim() && status !== EvaluationStatus.LOADING && status !== EvaluationStatus.CHATTING
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-[4px_4px_0px_0px_rgba(220,38,38,0.3)]'
                    : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
                }`}
              >
                {status === EvaluationStatus.LOADING || status === EvaluationStatus.CHATTING ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                Execute
              </button>
            </div>
          </div>
          <p className="text-center mt-4 text-[9px] text-zinc-800 font-black uppercase tracking-[0.3em]">
            This is a simulation of extreme VC bias. Not financial advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
