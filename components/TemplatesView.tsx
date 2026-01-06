import React, { useState } from 'react';
import { Button } from './ui/Button';
import { LayoutTemplate, ArrowRight, Search, X, Sparkles } from 'lucide-react';
import { TEMPLATES } from '../data/templates';

interface TemplatesViewProps {
  onUseTemplate: (subject: string, body: string) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onUseTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-white">
       {/* Header */}
       <div className="px-8 py-8 md:py-10 max-w-7xl mx-auto w-full border-b border-stone-100">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="w-full md:max-w-md">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-2 tracking-tight flex items-center gap-3">
                   <LayoutTemplate size={32} className="text-stone-900" />
                   Starter Templates
                </h1>
                <p className="text-stone-500 text-lg mb-6">
                   Professionally crafted layouts to jumpstart your next campaign.
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
                        placeholder="Search templates (e.g. 'Newsletter', 'Sale')..."
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
         </div>
       </div>

       {/* Grid */}
       <div className="flex-grow overflow-y-auto px-6 py-8 bg-stone-50/30">
         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
            {filteredTemplates.map((template) => (
              <div 
                key={template.id} 
                onClick={() => onUseTemplate(template.subject, template.body)}
                className="group flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer"
              >
                {/* Card Container */}
                <div className="relative aspect-[9/16] w-full bg-stone-100 rounded-scoop overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:shadow-stone-200/50 transition-all duration-300 border border-stone-100 group-hover:-translate-y-2">
                  
                  {/* Live Preview Iframe */}
                  <iframe
                    srcDoc={template.body}
                    title={template.name}
                    className="absolute inset-0 w-[200%] h-[200%] transform origin-top-left scale-50 bg-white border-none pointer-events-none"
                    sandbox="allow-same-origin"
                    tabIndex={-1}
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-900 shadow-sm">
                    {template.category}
                  </div>

                  {/* Hover Action Button (Centered) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <button className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition-transform">
                            Use Template <ArrowRight size={16} />
                        </button>
                  </div>
                </div>

                {/* Info & Action */}
                <div className="flex items-center justify-between px-2">
                  <div>
                    <h3 className="font-bold text-stone-900 group-hover:text-pink-600 transition-colors">{template.name}</h3>
                    <p className="text-xs text-stone-500">HTML • Responsive</p>
                  </div>
                </div>
              </div>
            ))}

            {filteredTemplates.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-stone-400">
                    <Search size={32} className="mb-4 opacity-50" />
                    <h3 className="text-lg font-bold text-stone-900 mb-1">No templates found</h3>
                    <p className="text-sm">Try searching for a different category or keyword.</p>
                    <button onClick={() => setSearchTerm('')} className="text-blue-500 mt-4 hover:underline font-medium text-sm">Clear Search</button>
                </div>
            )}
         </div>
       </div>
    </div>
  );
};