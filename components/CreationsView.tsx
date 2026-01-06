import React, { useEffect, useState } from 'react';
import { Clock, MoreHorizontal, Send, FileEdit, Trash2, Search, Filter, Inbox, LayoutTemplate, X, ArrowRight } from 'lucide-react';
import { Creation } from '../types';

interface CreationsViewProps {
  onLoadCreation: (creation: Creation) => void;
  onCreateNew: () => void;
  onGoToTemplates: () => void;
}

export const CreationsView: React.FC<CreationsViewProps> = ({ onLoadCreation, onCreateNew, onGoToTemplates }) => {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCreations();
  }, []);

  const loadCreations = () => {
    try {
      const stored = localStorage.getItem('kindlymail_creations');
      if (stored) {
        setCreations(JSON.parse(stored).sort((a: Creation, b: Creation) => b.lastEdited - a.lastEdited));
      }
    } catch (e) {
      console.error("Failed to load creations", e);
    }
  };

  const deleteCreation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this draft?')) {
      const updated = creations.filter(c => c.id !== id);
      setCreations(updated);
      localStorage.setItem('kindlymail_creations', JSON.stringify(updated));
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return "Just now";
  };

  const filteredCreations = creations.filter(c => 
    c.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.snippet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-white">
       {/* Header */}
       <div className="px-8 py-8 md:py-10 max-w-7xl mx-auto w-full border-b border-stone-100">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="w-full md:max-w-md">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-2 tracking-tight">
                    My Creations
                </h1>
                <p className="text-stone-500 text-lg mb-6">
                    Your saved drafts and sent campaigns.
                </p>

                {/* Search Bar */}
                <div className="relative group w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-stone-900 transition-colors">
                        <Search size={20} />
                    </div>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search drafts..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-stone-300 transition-all shadow-sm"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-3 flex items-center text-stone-300 hover:text-stone-600"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>
            
            <div>
               <div className="text-sm font-medium text-stone-500 text-right mb-2">
                   {filteredCreations.length} Drafts
               </div>
            </div>
         </div>
       </div>

       {/* Grid */}
       <div className="flex-grow overflow-y-auto px-6 py-8 bg-stone-50/30">
         
         {creations.length === 0 ? (
             // Empty State
             <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 rotate-3 border border-stone-100">
                     <LayoutTemplate size={48} className="text-stone-300" />
                 </div>
                 <h2 className="text-2xl font-bold text-stone-900 mb-3 font-display">Start with a Blueprint</h2>
                 <p className="text-stone-500 mb-8 leading-relaxed">
                     You haven't saved any drafts yet. Jumpstart your creativity by using one of our professionally designed templates.
                 </p>
                 <button 
                    onClick={onGoToTemplates}
                    className="group bg-black text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-stone-300 hover:bg-stone-800 transition-all flex items-center gap-2 hover:px-10"
                 >
                     Browse Templates <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                 </button>
                 <button 
                    onClick={onCreateNew}
                    className="mt-6 text-sm font-medium text-stone-400 hover:text-stone-900 transition-colors"
                 >
                     Or start from scratch
                 </button>
             </div>
         ) : (
             <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {/* Create New Card */}
                <button 
                    onClick={onCreateNew}
                    className="border-2 border-dashed border-stone-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-stone-400 hover:text-stone-600 hover:border-stone-300 hover:bg-stone-50 transition-all h-[240px]"
                >
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                        <FileEdit size={24} />
                    </div>
                    <span className="font-medium">Start New Draft</span>
                </button>

                {filteredCreations.map((creation) => (
                  <div 
                    key={creation.id} 
                    onClick={() => onLoadCreation(creation)}
                    className="group bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-[240px] relative overflow-hidden cursor-pointer"
                  >
                    {/* Top Row */}
                    <div className="flex justify-between items-start mb-4">
                        <div className={`
                            px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                            ${creation.status === 'Draft' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}
                        `}>
                            {creation.status}
                        </div>
                        <button className="text-stone-300 hover:text-stone-900 transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-lg text-stone-900 mb-2 line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors">
                        {creation.subject || 'Untitled Draft'}
                    </h3>
                    <p className="text-stone-500 text-sm line-clamp-3 mb-auto">
                        {creation.snippet}
                    </p>

                    {/* Footer */}
                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-stone-400 font-medium">
                            <Clock size={12} />
                            {formatTimeAgo(creation.lastEdited)}
                        </div>
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
                             <button 
                                onClick={() => onLoadCreation(creation)}
                                className="p-2 hover:bg-stone-100 rounded-full text-stone-500 hover:text-stone-900" 
                                title="Edit"
                             >
                                <FileEdit size={14} />
                            </button>
                             <button 
                                onClick={(e) => deleteCreation(e, creation.id)}
                                className="p-2 hover:bg-red-50 rounded-full text-stone-500 hover:text-red-500" 
                                title="Delete"
                             >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                  </div>
                ))}
                
                {filteredCreations.length === 0 && searchTerm && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-stone-400">
                        <Search size={24} className="mb-2 opacity-50" />
                        <p>No creations found matching "{searchTerm}"</p>
                        <button onClick={() => setSearchTerm('')} className="text-sm text-blue-500 mt-2 hover:underline">Clear Search</button>
                    </div>
                )}
             </div>
         )}
       </div>
    </div>
  );
};