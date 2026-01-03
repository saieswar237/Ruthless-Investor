
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { StartupEvaluation, EvaluationStatus, User, Message } from './types';
import { evaluateStartupIdea, chatWithArchitect } from './services/geminiService';
import { Shield, Lock, Skull } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<StartupEvaluation[]>([]);
  const [activeEvaluation, setActiveEvaluation] = useState<StartupEvaluation | null>(null);
  const [status, setStatus] = useState<EvaluationStatus>(EvaluationStatus.IDLE);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('ri_user');
    const storedHistory = localStorage.getItem('ri_history');
    
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedHistory) setHistory(JSON.parse(storedHistory));
    
    setIsAuthLoading(false);
  }, []);

  const saveHistory = (newHistory: StartupEvaluation[]) => {
    setHistory(newHistory);
    localStorage.setItem('ri_history', JSON.stringify(newHistory));
  };

  const handleLogin = () => {
    const mockUser: User = {
      id: 'user_' + Date.now(),
      name: 'Startup Target',
      email: 'founder@pre-seed.fail',
      photoURL: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${Date.now()}`
    };
    setUser(mockUser);
    localStorage.setItem('ri_user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ri_user');
    setActiveEvaluation(null);
  };

  const handleSubmitIdea = async (idea: string) => {
    setStatus(EvaluationStatus.LOADING);
    try {
      const result = await evaluateStartupIdea(idea);
      const newEvaluation: StartupEvaluation = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        idea,
        analysis: result.analysis,
        reportCard: result.reportCard,
        sources: result.sources,
        chatHistory: []
      };
      
      const updatedHistory = [newEvaluation, ...history];
      saveHistory(updatedHistory);
      setActiveEvaluation(newEvaluation);
      setStatus(EvaluationStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(EvaluationStatus.ERROR);
      alert("The architect refuses to even listen to that garbage. (System Error)");
    }
  };

  const handleChat = async (question: string) => {
    if (!activeEvaluation) return;
    
    setStatus(EvaluationStatus.CHATTING);
    const newUserMsg: Message = { role: 'user', content: question };
    const updatedChatHistory = [...activeEvaluation.chatHistory, newUserMsg];
    
    try {
      const response = await chatWithArchitect(updatedChatHistory, question);
      const newModelMsg: Message = { role: 'model', content: response };
      
      const updatedEval = {
        ...activeEvaluation,
        chatHistory: [...updatedChatHistory, newModelMsg]
      };
      
      setActiveEvaluation(updatedEval);
      saveHistory(history.map(h => h.id === updatedEval.id ? updatedEval : h));
      setStatus(EvaluationStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(EvaluationStatus.SUCCESS);
      alert("Connection severed. The architect hung up.");
    }
  };

  const handleDeleteHistory = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    saveHistory(updated);
    if (activeEvaluation?.id === id) setActiveEvaluation(null);
  };

  const handleSelectEvaluation = (id: string) => {
    const selected = history.find(item => item.id === id);
    if (selected) {
      setActiveEvaluation(selected);
      setStatus(EvaluationStatus.SUCCESS);
    }
  };

  const handleNewEvaluation = () => {
    setActiveEvaluation(null);
    setStatus(EvaluationStatus.IDLE);
  };

  const handleDownloadPDF = useCallback(() => {
    if (!activeEvaluation) return;
    window.print();
  }, [activeEvaluation]);

  if (isAuthLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-6">
          <Shield className="animate-pulse text-red-700" size={64} strokeWidth={1} />
          <p className="text-red-900 font-black uppercase tracking-[0.5em] text-[10px]">Scanning Integrity...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#050505] p-6">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-red-900/40 p-12 space-y-10 shadow-[0_0_100px_rgba(220,38,38,0.1)] relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-950/20 border border-red-900/50 text-red-600 mb-6 group">
              <Skull size={40} className="group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              RUTHLESS <span className="text-red-600">INVESTOR</span>
            </h1>
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Capital is finite. Weakness is fatal.</p>
          </div>
          
          <div className="space-y-6">
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-4 bg-red-600 hover:bg-red-700 text-white font-black py-4 px-6 rounded-none transition-all shadow-[6px_6px_0px_0px_rgba(220,38,38,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase tracking-widest text-xs"
            >
              Enter the Boardroom
            </button>
            <p className="text-center text-[9px] text-zinc-800 font-black uppercase tracking-widest">
              By entering, you accept that your ego may be permanently damaged.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-[#050505] text-gray-100 selection:bg-red-600/30">
      <Sidebar 
        history={history}
        activeId={activeEvaluation?.id || null}
        onSelect={handleSelectEvaluation}
        onNew={handleNewEvaluation}
        onDelete={handleDeleteHistory}
        onLogout={handleLogout}
        user={user}
      />
      
      <main className="flex-1 relative flex flex-col min-w-0">
        <ChatInterface 
          evaluation={activeEvaluation}
          status={status}
          onSubmit={handleSubmitIdea}
          onChat={handleChat}
          onDownload={handleDownloadPDF}
        />
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          aside, .absolute.bottom-0, button, .sources-panel { display: none !important; }
          main { width: 100% !important; margin: 0 !important; padding: 2rem !important; background: white !important; }
          .max-w-4xl { max-width: 100% !important; }
          body { background: white !important; color: black !important; }
          .bg-[#0a0a0a], .bg-[#050505], .bg-red-950/5 { background: white !important; color: black !important; border: 1px solid #ddd !important; }
          .text-white, .text-gray-300, .text-gray-400, .text-red-400, .text-red-500 { color: black !important; }
          .border-red-600 { border-color: black !important; }
          .prose-invert { filter: none !important; color: black !important; }
          .shadow-2xl, .shadow-xl { box-shadow: none !important; }
        }
      `}} />
    </div>
  );
};

export default App;
