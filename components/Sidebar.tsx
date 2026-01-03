
import React from 'react';
import { Plus, MessageSquare, Trash2, LogOut, Search } from 'lucide-react';
import { StartupEvaluation, User } from '../types';

interface SidebarProps {
  history: StartupEvaluation[];
  onSelect: (evaluId: string) => void;
  onNew: () => void;
  onDelete: (evaluId: string) => void;
  onLogout: () => void;
  user: User | null;
  activeId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ history, onSelect, onNew, onDelete, onLogout, user, activeId }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-[#0e0e0e] border-r border-red-900/30 flex flex-col h-full overflow-hidden transition-all duration-300 md:relative absolute z-50 md:z-auto -translate-x-full md:translate-x-0">
      <div className="p-6">
        <div className="mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-red-600"></div>
            <h2 className="text-sm font-black text-red-600 uppercase tracking-tighter italic">Ruthless Investor</h2>
        </div>
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-sm transition-all text-xs font-black uppercase tracking-widest border border-red-500 shadow-[4px_4px_0px_0px_rgba(220,38,38,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <Plus size={16} />
          New Pitch
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
        <div className="px-2 py-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
          Kill List
        </div>
        {history.length === 0 ? (
          <div className="px-2 py-4 text-[11px] text-gray-700 uppercase font-bold italic">No ideas slaughtered yet</div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-sm cursor-pointer transition-all border-l-2 mb-1 ${
                activeId === item.id 
                  ? 'bg-red-950/20 border-red-600 text-red-500' 
                  : 'border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300'
              }`}
              onClick={() => onSelect(item.id)}
            >
              <MessageSquare size={14} className="flex-shrink-0" />
              <span className="truncate text-xs font-bold uppercase tracking-tight flex-1">{item.idea}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      {user && (
        <div className="p-4 border-t border-red-900/20 bg-black/40">
          <div className="flex items-center gap-3 mb-4">
            <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-none border border-red-900 grayscale hover:grayscale-0 transition-all" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-gray-300 truncate uppercase">{user.name}</p>
              <p className="text-[9px] text-gray-600 truncate uppercase">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-[10px] text-gray-600 hover:text-red-500 font-black uppercase tracking-widest transition-colors"
          >
            <LogOut size={12} />
            Eject
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
