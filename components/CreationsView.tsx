import React, { useEffect, useState } from 'react';
import { Clock, MoreHorizontal, Send, FileEdit, Trash2, Search, Filter, Inbox } from 'lucide-react';
import { Creation } from '../types';

interface CreationsViewProps {
  onLoadCreation: (creation: Creation) => void;
  onCreateNew: () => void;
}

export const CreationsView: React.FC<CreationsViewProps> = ({ onLoadCreation, onCreateNew }) => {
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
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-2 tracking-tight">
                    My Creations
                </h1>
                <p className="text-stone-500 text-lg">
                    Your saved drafts and sent campaigns.
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..." 
                        className="pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black/5"
                    />
                </div>
                <button className="p-2 bg-stone-50 border border-stone-200 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors">
                    <Filter size={18} />
                </button>
            </div>
         </div>
       </div>

       {/* Grid */}
       <div className="flex-grow overflow-y-auto px-6 py-8 bg-stone-50/30">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
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
                    <p>No creations found matching "{searchTerm}"</p>
                </div>
            )}
         </div>
       </div>
    </div>
  );
};