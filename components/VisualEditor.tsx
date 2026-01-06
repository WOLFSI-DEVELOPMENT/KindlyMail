import React, { useEffect, useState } from 'react';
import { Type, Layout, Image as ImageIcon, PaintBucket, Square, EyeOff, Trash2, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';

interface VisualEditorProps {
  selectedElement: HTMLElement | null;
  onUpdate: () => void; // Trigger to sync changes back to draft state
}

export const VisualEditor: React.FC<VisualEditorProps> = ({ selectedElement, onUpdate }) => {
  const [activeSection, setActiveSection] = useState<string | null>('content');
  
  // Force re-render when selection changes
  const [_, setTick] = useState(0);
  useEffect(() => {
    setTick(t => t + 1);
  }, [selectedElement]);

  if (!selectedElement) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-stone-400 p-8 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-4 border border-stone-100">
            <Layout size={32} />
        </div>
        <h3 className="text-stone-900 font-bold mb-2">No Element Selected</h3>
        <p className="text-sm">Click on any element in the email preview to start editing its styles.</p>
      </div>
    );
  }

  const tagName = selectedElement.tagName.toLowerCase();
  const computedStyle = window.getComputedStyle(selectedElement);

  // Helper to update style
  const updateStyle = (property: string, value: string) => {
    selectedElement.style[property as any] = value;
    setTick(t => t + 1);
    onUpdate();
  };

  const updateAttribute = (attr: string, value: string) => {
    selectedElement.setAttribute(attr, value);
    setTick(t => t + 1);
    onUpdate();
  };

  const updateContent = (value: string) => {
    selectedElement.innerText = value;
    setTick(t => t + 1);
    onUpdate();
  };

  const SectionHeader = ({ id, icon: Icon, title }: { id: string, icon: any, title: string }) => (
    <button 
      onClick={() => setActiveSection(activeSection === id ? null : id)}
      className="w-full flex items-center justify-between p-4 border-b border-stone-100 hover:bg-stone-50 transition-colors"
    >
      <div className="flex items-center gap-3 font-semibold text-stone-700 text-sm">
        <Icon size={16} />
        {title}
      </div>
      <div className={`text-stone-400 transition-transform ${activeSection === id ? 'rotate-180' : ''}`}>
        ▼
      </div>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      
      {/* Selected Element Badge */}
      <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex justify-between items-center text-xs font-mono text-stone-500 uppercase">
        <span>&lt;{tagName}&gt;</span>
        <span className="bg-stone-200 px-1.5 py-0.5 rounded text-[10px] text-stone-700">
            {selectedElement.id ? `#${selectedElement.id}` : 'No ID'}
        </span>
      </div>

      {/* 1. Content Editing (Text/Image/Link) */}
      <SectionHeader id="content" icon={Type} title="Content" />
      {activeSection === 'content' && (
        <div className="p-4 space-y-4 border-b border-stone-100 animate-in slide-in-from-top-2 duration-200">
           
           {tagName === 'img' && (
             <div className="space-y-2">
               <label className="text-xs font-semibold text-stone-500">Image Source URL</label>
               <input 
                  type="text" 
                  value={selectedElement.getAttribute('src') || ''}
                  onChange={(e) => updateAttribute('src', e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/5 outline-none"
               />
               <label className="text-xs font-semibold text-stone-500 mt-2">Alt Text</label>
               <input 
                  type="text" 
                  value={selectedElement.getAttribute('alt') || ''}
                  onChange={(e) => updateAttribute('alt', e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/5 outline-none"
               />
             </div>
           )}

           {tagName === 'a' && (
             <div className="space-y-2">
               <label className="text-xs font-semibold text-stone-500 flex items-center gap-2">
                 <LinkIcon size={12} /> Link URL (Href)
               </label>
               <input 
                  type="text" 
                  value={selectedElement.getAttribute('href') || ''}
                  onChange={(e) => updateAttribute('href', e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/5 outline-none"
               />
             </div>
           )}

           {/* Generic Text Editing (if not an image or void tag) */}
           {!['img', 'hr', 'br', 'input'].includes(tagName) && (
             <div className="space-y-2">
               <label className="text-xs font-semibold text-stone-500">Text Content</label>
               <textarea 
                  value={selectedElement.innerText}
                  onChange={(e) => updateContent(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/5 outline-none min-h-[80px]"
               />
             </div>
           )}
        </div>
      )}

      {/* 2. Typography */}
      <SectionHeader id="typography" icon={Type} title="Typography" />
      {activeSection === 'typography' && (
        <div className="p-4 space-y-4 border-b border-stone-100 animate-in slide-in-from-top-2 duration-200">
           
           <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1">
               <label className="text-xs font-medium text-stone-400">Font Size (px)</label>
               <input 
                 type="number"
                 value={parseInt(computedStyle.fontSize)}
                 onChange={(e) => updateStyle('fontSize', `${e.target.value}px`)}
                 className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-sm"
               />
             </div>
             <div className="space-y-1">
               <label className="text-xs font-medium text-stone-400">Line Height</label>
               <input 
                 type="number"
                 step="0.1"
                 value={parseFloat(computedStyle.lineHeight) || 1.5}
                 onChange={(e) => updateStyle('lineHeight', e.target.value)}
                 className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-sm"
               />
             </div>
           </div>

           <div className="space-y-1">
             <label className="text-xs font-medium text-stone-400">Color</label>
             <div className="flex gap-2">
                <input 
                  type="color"
                  value={rgbToHex(computedStyle.color)}
                  onChange={(e) => updateStyle('color', e.target.value)}
                  className="h-9 w-9 p-0 rounded-lg border-none cursor-pointer"
                />
                <input 
                  type="text"
                  value={rgbToHex(computedStyle.color)}
                  onChange={(e) => updateStyle('color', e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-sm uppercase"
                />
             </div>
           </div>
            
           <div className="flex justify-between bg-stone-50 p-1 rounded-lg border border-stone-200">
              <button onClick={() => updateStyle('textAlign', 'left')} className={`p-2 rounded ${computedStyle.textAlign === 'left' ? 'bg-white shadow-sm text-black' : 'text-stone-400'}`}><AlignLeft size={16} /></button>
              <button onClick={() => updateStyle('textAlign', 'center')} className={`p-2 rounded ${computedStyle.textAlign === 'center' ? 'bg-white shadow-sm text-black' : 'text-stone-400'}`}><AlignCenter size={16} /></button>
              <button onClick={() => updateStyle('textAlign', 'right')} className={`p-2 rounded ${computedStyle.textAlign === 'right' ? 'bg-white shadow-sm text-black' : 'text-stone-400'}`}><AlignRight size={16} /></button>
           </div>

           <div className="flex justify-between bg-stone-50 p-1 rounded-lg border border-stone-200">
              <button onClick={() => updateStyle('fontWeight', computedStyle.fontWeight === '700' ? '400' : '700')} className={`p-2 rounded ${computedStyle.fontWeight === '700' || parseInt(computedStyle.fontWeight) > 500 ? 'bg-white shadow-sm text-black' : 'text-stone-400'}`}><Bold size={16} /></button>
              <button onClick={() => updateStyle('fontStyle', computedStyle.fontStyle === 'italic' ? 'normal' : 'italic')} className={`p-2 rounded ${computedStyle.fontStyle === 'italic' ? 'bg-white shadow-sm text-black' : 'text-stone-400'}`}><Italic size={16} /></button>
              <button onClick={() => updateStyle('textDecoration', computedStyle.textDecorationLine.includes('underline') ? 'none' : 'underline')} className={`p-2 rounded ${computedStyle.textDecorationLine.includes('underline') ? 'bg-white shadow-sm text-black' : 'text-stone-400'}`}><Underline size={16} /></button>
           </div>

           <div className="space-y-1">
               <label className="text-xs font-medium text-stone-400">Font Family</label>
               <select 
                 value={computedStyle.fontFamily.replace(/['"]/g, '')}
                 onChange={(e) => updateStyle('fontFamily', e.target.value)}
                 className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-sm"
               >
                 <option value="Helvetica Neue, Helvetica, Arial, sans-serif">Helvetica Neue</option>
                 <option value="Arial, sans-serif">Arial</option>
                 <option value="Times New Roman, serif">Times New Roman</option>
                 <option value="Georgia, serif">Georgia</option>
                 <option value="Courier New, monospace">Courier New</option>
                 <option value="Verdana, sans-serif">Verdana</option>
               </select>
            </div>
        </div>
      )}

      {/* 3. Layout (Padding/Margin) */}
      <SectionHeader id="layout" icon={Layout} title="Layout & Spacing" />
      {activeSection === 'layout' && (
        <div className="p-4 space-y-4 border-b border-stone-100 animate-in slide-in-from-top-2 duration-200">
           
           {/* Padding */}
           <div className="space-y-2">
             <label className="text-xs font-bold text-stone-500 uppercase">Padding (px)</label>
             <div className="grid grid-cols-2 gap-2">
                <div>
                   <span className="text-[10px] text-stone-400">Top/Bottom</span>
                   <input type="range" min="0" max="100" 
                      value={parseInt(computedStyle.paddingTop) || 0}
                      onChange={(e) => {
                          updateStyle('paddingTop', `${e.target.value}px`);
                          updateStyle('paddingBottom', `${e.target.value}px`);
                      }}
                      className="w-full accent-black"
                   />
                </div>
                <div>
                   <span className="text-[10px] text-stone-400">Left/Right</span>
                   <input type="range" min="0" max="100" 
                      value={parseInt(computedStyle.paddingLeft) || 0}
                      onChange={(e) => {
                          updateStyle('paddingLeft', `${e.target.value}px`);
                          updateStyle('paddingRight', `${e.target.value}px`);
                      }}
                      className="w-full accent-black"
                   />
                </div>
             </div>
           </div>

           {/* Margin */}
           <div className="space-y-2">
             <label className="text-xs font-bold text-stone-500 uppercase">Margin (px)</label>
             <div className="grid grid-cols-2 gap-2">
                <div>
                   <span className="text-[10px] text-stone-400">Top/Bottom</span>
                   <input type="range" min="0" max="100" 
                      value={parseInt(computedStyle.marginTop) || 0}
                      onChange={(e) => {
                          updateStyle('marginTop', `${e.target.value}px`);
                          updateStyle('marginBottom', `${e.target.value}px`);
                      }}
                      className="w-full accent-black"
                   />
                </div>
                <div>
                    <span className="text-[10px] text-stone-400">Width (%)</span>
                    <input type="range" min="0" max="100" 
                        value={parseInt(computedStyle.width) === 0 ? 100 : (parseInt(selectedElement.style.width) || 100)}
                        onChange={(e) => updateStyle('width', `${e.target.value}%`)}
                        className="w-full accent-black"
                    />
                </div>
             </div>
           </div>

        </div>
      )}

      {/* 4. Background & Borders */}
      <SectionHeader id="style" icon={PaintBucket} title="Background & Borders" />
      {activeSection === 'style' && (
        <div className="p-4 space-y-4 border-b border-stone-100 animate-in slide-in-from-top-2 duration-200">
           
           <div className="space-y-1">
             <label className="text-xs font-medium text-stone-400">Background Color</label>
             <div className="flex gap-2">
                <input 
                  type="color"
                  value={rgbToHex(computedStyle.backgroundColor)}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                  className="h-9 w-9 p-0 rounded-lg border-none cursor-pointer"
                />
                <button 
                    onClick={() => updateStyle('backgroundColor', 'transparent')}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100"
                >
                    Transparent
                </button>
             </div>
           </div>

           <div className="space-y-1">
             <label className="text-xs font-medium text-stone-400">Border Radius (px)</label>
             <input type="range" min="0" max="50" 
                value={parseInt(computedStyle.borderRadius) || 0}
                onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
                className="w-full accent-black"
             />
           </div>

           <div className="space-y-1">
             <label className="text-xs font-medium text-stone-400">Border</label>
             <div className="flex gap-2">
                <select 
                    onChange={(e) => {
                        updateStyle('borderStyle', 'solid');
                        updateStyle('borderWidth', `${e.target.value}px`);
                    }}
                    className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-sm"
                >
                    <option value="0">None</option>
                    <option value="1">1px</option>
                    <option value="2">2px</option>
                    <option value="4">4px</option>
                </select>
                <input 
                  type="color"
                  value={rgbToHex(computedStyle.borderColor)}
                  onChange={(e) => updateStyle('borderColor', e.target.value)}
                  className="h-9 w-9 p-0 rounded-lg border-none cursor-pointer"
                />
             </div>
           </div>

        </div>
      )}
      
      {/* 5. Actions */}
      <div className="mt-auto p-4 border-t border-stone-100 bg-stone-50">
          <label className="text-xs font-bold text-stone-500 uppercase mb-3 block">Quick Actions</label>
          <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => updateStyle('display', 'none')}
                className="flex items-center justify-center gap-2 bg-white border border-stone-200 text-stone-600 py-2 rounded-lg hover:bg-stone-50 hover:text-stone-900 transition-colors text-sm font-medium"
              >
                  <EyeOff size={14} /> Hide
              </button>
              <button 
                onClick={() => {
                    selectedElement.remove();
                    onUpdate();
                }}
                className="flex items-center justify-center gap-2 bg-white border border-red-100 text-red-500 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
              >
                  <Trash2 size={14} /> Remove
              </button>
          </div>
      </div>

    </div>
  );
};

// Utility to convert RGB(a) to Hex for inputs
function rgbToHex(col: string) {
    if(!col) return '#000000';
    if(col.startsWith('#')) return col;
    const rgba = col.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
    const hex = `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1)}`;
    return hex;
}