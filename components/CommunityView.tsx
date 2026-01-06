import React, { useEffect, useState } from 'react';
import { Search, Heart, Share2, Copy, RefreshCw, LayoutTemplate } from 'lucide-react';
import { fetchCommunityCreations, CommunityCreation } from '../services/supabase';

interface CommunityViewProps {
  onRemix: (creation: CommunityCreation) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onRemix }) => {
  const [creations, setCreations] = useState<CommunityCreation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
      setLoading(true);
      const data = await fetchCommunityCreations();
      setCreations(data);
      setLoading(false);
  };

  useEffect(() => {
      loadData();
  }, []);

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-white">
       {/* Header */}
       <div className="px-8 py-8 md:py-10 max-w-7xl mx-auto w-full border-b border-stone-100 flex flex-col md:flex-row justify-between items-end gap-6">
         <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-2 tracking-tight">
                Community
            </h1>
            <p className="text-stone-500 text-lg">
                Discover, remix, and learn from the best email designers.
            </p>
         </div>
         <button 
            onClick={loadData}
            className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 bg-stone-50 px-4 py-2 rounded-full hover:bg-stone-100 transition-colors"
         >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
         </button>
       </div>

       {/* Grid */}
       <div className="flex-grow overflow-y-auto px-6 py-8 bg-stone-50/30">
         {loading ? (
             <div className="flex justify-center py-20">
                 <div className="w-8 h-8 border-2 border-stone-200 border-t-black rounded-full animate-spin"></div>
             </div>
         ) : (
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {creations.map((item) => (
                    <div key={item.id} className="group flex flex-col gap-4">
                        {/* Preview Card */}
                        <div className="relative aspect-[9/16] w-full bg-white rounded-3xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 border border-stone-100">
                             <iframe
                                srcDoc={item.body}
                                title={item.subject}
                                className="absolute inset-0 w-[200%] h-[200%] transform origin-top-left scale-50 bg-white border-none pointer-events-none"
                                sandbox="allow-same-origin"
                             />
                             
                             {/* Overlay */}
                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button 
                                    onClick={() => onRemix(item)}
                                    className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-stone-50"
                                >
                                    <Copy size={14} /> Remix Template
                                </button>
                             </div>
                        </div>

                        {/* Info */}
                        <div>
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-stone-900 truncate pr-2">{item.subject}</h3>
                                <div className="flex items-center text-xs text-stone-400 gap-1">
                                    <Heart size={12} className="text-pink-500 fill-pink-500" /> {item.likes_count || 0}
                                </div>
                            </div>
                            <p className="text-xs text-stone-500 mb-2">by {item.author_name || 'Anonymous'}</p>
                        </div>
                    </div>
                ))}

                {creations.length === 0 && (
                    <div className="col-span-full text-center py-20 text-stone-400">
                        <LayoutTemplate size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No community posts yet. Be the first to publish!</p>
                    </div>
                )}
            </div>
         )}
       </div>
    </div>
  );
};
