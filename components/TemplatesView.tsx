import React from 'react';
import { Button } from './ui/Button';
import { LayoutTemplate, ArrowRight } from 'lucide-react';
import { TEMPLATES } from '../data/templates';

interface TemplatesViewProps {
  onUseTemplate: (subject: string, body: string) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onUseTemplate }) => {
  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-white">
       {/* Header */}
       <div className="px-8 py-8 md:py-12 max-w-7xl mx-auto w-full">
         <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight">
           Starter Templates
         </h1>
         <p className="text-stone-500 text-lg max-w-xl">
           Professionally crafted layouts to jumpstart your next campaign. 
           Optimized for conversion and aesthetics.
         </p>
       </div>

       {/* Grid */}
       <div className="flex-grow overflow-y-auto px-6 pb-20">
         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {TEMPLATES.map((template) => (
              <div 
                key={template.id} 
                className="group flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {/* Card Container */}
                <div className="relative aspect-[9/16] w-full bg-stone-100 rounded-scoop overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 border border-stone-100">
                  
                  {/* Live Preview Iframe */}
                  <iframe
                    srcDoc={template.body}
                    title={template.name}
                    className="absolute inset-0 w-[200%] h-[200%] transform origin-top-left scale-50 bg-white border-none pointer-events-none"
                    sandbox="allow-same-origin"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-900 shadow-sm">
                    {template.category}
                  </div>
                </div>

                {/* Info & Action */}
                <div className="flex items-center justify-between px-2">
                  <div>
                    <h3 className="font-bold text-stone-900">{template.name}</h3>
                    <p className="text-xs text-stone-500">HTML • Responsive</p>
                  </div>
                  <Button 
                    variant="icon"
                    className="group-hover:bg-black group-hover:text-white transition-colors"
                    onClick={() => onUseTemplate(template.subject, template.body)}
                    title="Use this template"
                  >
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            ))}
         </div>
       </div>
    </div>
  );
};