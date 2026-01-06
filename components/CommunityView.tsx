import React, { useEffect, useState } from 'react';
import { Search, Heart, Share2, Copy, RefreshCw, LayoutTemplate, X, User, Sparkles, TrendingUp, Clock, Filter, Zap } from 'lucide-react';
import { fetchCommunityCreations, CommunityCreation } from '../services/supabase';

interface CommunityViewProps {
  onRemix: (creation: CommunityCreation) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onRemix }) => {
  const [creations, setCreations] = useState<CommunityCreation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'trending' | 'new' | 'popular'>('trending');

  const loadData = async () => {
      setLoading(true);
      const data = await fetchCommunityCreations();
      setCreations(data);
      setLoading(false);
  };

  useEffect(() => {
      loadData();
  }, []);

  // Filter Logic
  const filteredCreations = creations.filter(c => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = c.subject.toLowerCase().includes(searchLower) || 
                            c.author_name.toLowerCase().includes(searchLower) ||
                            c.snippet.toLowerCase().includes(searchLower);
      
      const matchesCreator = selectedCreator ? c.author_name === selectedCreator : true;
      
      return matchesSearch && matchesCreator;
  }).sort((a, b) => {
      if (activeFilter === 'new') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (activeFilter === 'popular') {
          return (b.likes_count || 0) - (a.likes_count || 0);
      }
      // Trending (Default - Mix of recency and likes/remixes)
      return ((b.likes_count || 0) + (b.remix_count || 0)) - ((a.likes_count || 0) + (a.remix_count || 0));
  });

  // Generate a consistent color for author avatars based on name
  const getAvatarColor = (name: string) => {
      const colors = ['bg-pink-100 text-pink-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-amber-100 text-amber-600', 'bg-purple-100 text-purple-600'];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
          hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-white font-sans">
       
       {/* Hero / Header Section */}
       <div className="flex-shrink-0 pt-10 pb-6 px-6 bg-white border-b border-stone-50 z-10">
         <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="w-full md:max-w-xl">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-2 tracking-tight flex items-center gap-2">
                    <Sparkles className="text-amber-400 fill-amber-400" size={24} />
                    Community Showcase
                </h1>
                <p className="text-stone-500 text-lg mb-6">
                    Discover, remix, and learn from the best email designers.
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
                        placeholder="Search templates, subjects, or creators..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-stone-300 transition-all shadow-sm"
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

            {/* Actions & Filters */}
            <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                <button 
                    onClick={loadData}
                    className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh List
                </button>
                
                <div className="flex bg-stone-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveFilter('trending')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === 'trending' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                    >
                        <TrendingUp size={14} /> Trending
                    </button>
                    <button 
                        onClick={() => setActiveFilter('new')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === 'new' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                    >
                        <Clock size={14} /> Newest
                    </button>
                    <button 
                        onClick={() => setActiveFilter('popular')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === 'popular' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                    >
                        <Heart size={14} /> Popular
                    </button>
                </div>
            </div>
         </div>
       </div>

       {/* Grid */}
       <div className="flex-grow overflow-y-auto px-6 py-8 bg-stone-50/30">
         {loading ? (
             <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                 {[...Array(8)].map((_, i) => (
                     <div key={i} className="flex flex-col gap-4">
                         <div className="aspect-[3/4] bg-stone-100 rounded-[2rem] animate-pulse"></div>
                         <div className="space-y-2 px-2">
                             <div className="h-4 bg-stone-100 rounded w-3/4 animate-pulse"></div>
                             <div className="h-3 bg-stone-100 rounded w-1/2 animate-pulse"></div>
                         </div>
                     </div>
                 ))}
             </div>
         ) : (
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
                {filteredCreations.map((item) => (
                    <div key={item.id} className="group flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Card Container */}
                        <div className="relative aspect-[3/4] w-full bg-white rounded-[2.5rem] overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:shadow-stone-200/50 transition-all duration-300 border border-stone-100 hover:-translate-y-2">
                             
                             {/* Preview Iframe */}
                             <iframe
                                srcDoc={item.body}
                                title={item.subject}
                                className="absolute inset-0 w-[200%] h-[200%] transform origin-top-left scale-50 bg-white border-none pointer-events-none"
                                sandbox="allow-same-origin"
                                tabIndex={-1}
                             />
                             
                             {/* Overlay Gradient */}
                             <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                             {/* Floating Action Button */}
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                <button 
                                    onClick={() => onRemix(item)}
                                    className="bg-stone-900 text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
                                >
                                    <Zap size={16} className="fill-white" /> Remix Design
                                </button>
                             </div>

                             {/* Quick Stats on Card (Optional) */}
                             <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
                                <Copy size={12} /> {item.remix_count || 0}
                             </div>
                        </div>

                        {/* Info Section */}
                        <div className="px-2">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-stone-900 truncate pr-2 text-lg leading-tight group-hover:text-pink-600 transition-colors cursor-pointer" onClick={() => onRemix(item)}>{item.subject}</h3>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <button 
                                    onClick={() => setSelectedCreator(item.author_name)}
                                    className="flex items-center gap-2 group/author"
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${getAvatarColor(item.author_name)}`}>
                                        {item.author_name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-xs font-medium text-stone-500 group-hover/author:text-stone-900 transition-colors">
                                        {item.author_name || 'Anonymous'}
                                    </span>
                                </button>

                                <div className="flex items-center gap-3 text-xs text-stone-400 font-medium">
                                    <div className="flex items-center gap-1">
                                        <Heart size={12} className={item.likes_count ? "text-pink-500 fill-pink-500" : ""} />
                                        {item.likes_count || 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredCreations.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-stone-400">
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                            <Search size={24} className="opacity-50" />
                        </div>
                        <h3 className="text-lg font-bold text-stone-900 mb-1">No results found</h3>
                        <p className="text-sm">Try adjusting your search terms or filters.</p>
                        {(searchTerm || selectedCreator) && (
                            <button 
                                onClick={() => { setSearchTerm(''); setSelectedCreator(null); }}
                                className="mt-4 text-blue-600 hover:underline font-medium text-sm"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>
         )}
       </div>

       {/* Creator Profile Modal */}
       {selectedCreator && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedCreator(null)}></div>
               <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 border border-stone-100">
                   <div className="flex justify-between items-start mb-8">
                       <div className="flex items-center gap-5">
                           <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg border-4 border-white ${getAvatarColor(selectedCreator)}`}>
                               <User size={32} className="opacity-80"/>
                           </div>
                           <div>
                               <h2 className="text-3xl font-bold text-stone-900 font-display mb-1">{selectedCreator}</h2>
                               <div className="flex items-center gap-3">
                                   <span className="text-stone-500 text-sm font-medium bg-stone-100 px-2 py-0.5 rounded-md">Creator</span>
                                   <span className="text-stone-400 text-sm">•</span>
                                   <span className="text-stone-500 text-sm">{filteredCreations.length} Templates</span>
                               </div>
                           </div>
                       </div>
                       <button onClick={() => setSelectedCreator(null)} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-stone-900 transition-colors"><X size={24}/></button>
                   </div>
                   
                   <p className="text-base text-stone-600 mb-8 leading-relaxed">
                       Viewing all templates published by <strong>{selectedCreator}</strong>. 
                       Click any template in the background grid to remix their style.
                   </p>
                   
                   <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setSelectedCreator(null)}
                            className="w-full bg-stone-100 text-stone-900 rounded-xl py-3.5 font-bold hover:bg-stone-200 transition-all"
                        >
                            Close Profile
                        </button>
                        <button 
                            onClick={() => setSelectedCreator(null)} // Placeholder for "Follow" functionality
                            className="w-full bg-black text-white rounded-xl py-3.5 font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
                        >
                            <User size={18} /> Follow Creator
                        </button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};