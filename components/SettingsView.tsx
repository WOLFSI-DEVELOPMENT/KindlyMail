import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, FileText, Image as ImageIcon, FileCode, File, Trash2, Cpu, ChevronDown, Check } from 'lucide-react';
import { UploadedFile, PersonalContext, ToneSettings } from '../types';
import { ContextVisualizer } from './ContextVisualizer';
import { TextArea } from './ui/Input';
import { Button } from './ui/Button';

interface SettingsViewProps {
  context: PersonalContext;
  onUpdateContext: (newContext: PersonalContext) => void;
}

const ToneDropdown: React.FC<{
  label: string;
  value: string;
  options: { label: string; description?: string; value: string }[];
  onChange: (val: any) => void;
}> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between py-4 border-b border-stone-100 last:border-0 relative">
      <span className="text-stone-800 font-medium">{label}</span>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium"
        >
          {value}
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
             {options.map((opt) => (
               <button
                 key={opt.value}
                 onClick={() => {
                   onChange(opt.value);
                   setIsOpen(false);
                 }}
                 className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-stone-50 transition-colors flex items-start justify-between group"
               >
                 <div>
                   <div className="text-sm font-medium text-stone-900">{opt.label}</div>
                   {opt.description && (
                     <div className="text-[10px] text-stone-500 leading-tight mt-0.5">{opt.description}</div>
                   )}
                 </div>
                 {value === opt.value && <Check size={14} className="text-stone-900 mt-1" />}
               </button>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const SettingsView: React.FC<SettingsViewProps> = ({ context, onUpdateContext }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const processFiles = async (newFiles: File[]) => {
    if (context.files.length + newFiles.length > 20) {
      alert("You can upload a maximum of 20 files.");
      return;
    }

    const processedFiles: UploadedFile[] = await Promise.all(newFiles.map(file => {
      return new Promise<UploadedFile>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            content: e.target?.result as string,
            timestamp: Date.now()
          });
        };
        
        if (file.type.startsWith('image/')) {
          reader.readAsDataURL(file);
        } else {
          if (file.type === 'application/pdf') {
             resolve({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.type,
                size: file.size,
                content: `[PDF File: ${file.name}]`,
                timestamp: Date.now()
             });
          } else {
             reader.readAsText(file);
          }
        }
      });
    }));

    onUpdateContext({
      ...context,
      files: [...context.files, ...processedFiles]
    });
  };

  const removeFile = (id: string) => {
    onUpdateContext({
      ...context,
      files: context.files.filter(f => f.id !== id)
    });
  };

  const updateInstructions = (text: string) => {
    onUpdateContext({
      ...context,
      systemInstructions: text
    });
  };

  const updateTone = (key: keyof ToneSettings, value: any) => {
    onUpdateContext({
      ...context,
      toneSettings: {
        ...context.toneSettings,
        [key]: value
      }
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon size={18} className="text-pink-500" />;
    if (type.includes('pdf')) return <FileText size={18} className="text-red-500" />;
    if (type.includes('html') || type.includes('code')) return <FileCode size={18} className="text-blue-500" />;
    return <File size={18} className="text-stone-400" />;
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-stone-50 overflow-hidden">
      
      {/* Header */}
      <div className="px-8 py-8 bg-white border-b border-stone-100 shrink-0">
         <h1 className="font-display text-3xl font-bold text-stone-900 mb-2 tracking-tight flex items-center gap-3">
           <Cpu className="text-stone-900" />
           Memory and Personalization
         </h1>
         <p className="text-stone-500 max-w-2xl">
           Teach the AI about you. Upload past emails, brand guidelines, or style manuals. 
           Everything here helps KindlyMail generate more personalized drafts.
         </p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        
        {/* Left Column: Controls (Scrollable) */}
        {/* Added 'scroll-smooth' and 'overscroll-contain' for better scrolling feel */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto p-6 lg:p-8 custom-scrollbar space-y-8 pb-20 scroll-smooth overscroll-contain">
            
            {/* Characteristics Section */}
            <div className="space-y-4">
                <div>
                   <label className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                        Characteristics
                   </label>
                   <p className="text-xs text-stone-500 mt-1">
                      Choose additional customizations on top of your base style and tone.
                   </p>
                </div>
                
                <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-stone-200">
                    <ToneDropdown 
                        label="Warm" 
                        value={context.toneSettings?.warmth || 'Default'}
                        options={[
                            { label: 'More', value: 'More', description: 'More welcoming and gentle' },
                            { label: 'Default', value: 'Default' },
                            { label: 'Less', value: 'Less', description: 'Cooler and distant' }
                        ]}
                        onChange={(val) => updateTone('warmth', val)}
                    />
                    <ToneDropdown 
                        label="Enthusiastic" 
                        value={context.toneSettings?.enthusiasm || 'Default'}
                        options={[
                            { label: 'More', value: 'More', description: 'Friendlier and more personable' },
                            { label: 'Default', value: 'Default' },
                            { label: 'Less', value: 'Less', description: 'More professional and factual' }
                        ]}
                        onChange={(val) => updateTone('enthusiasm', val)}
                    />
                    <ToneDropdown 
                        label="Headers & Lists" 
                        value={context.toneSettings?.formatting || 'Default'}
                        options={[
                            { label: 'More', value: 'More', description: 'Frequent use of structure' },
                            { label: 'Default', value: 'Default' },
                            { label: 'Less', value: 'Less', description: 'More paragraph based' }
                        ]}
                        onChange={(val) => updateTone('formatting', val)}
                    />
                    <ToneDropdown 
                        label="Emoji" 
                        value={context.toneSettings?.emojis || 'Default'}
                        options={[
                            { label: 'More', value: 'More', description: 'Expressive and fun' },
                            { label: 'Default', value: 'Default' },
                            { label: 'Less', value: 'Less', description: 'Strictly text only' }
                        ]}
                        onChange={(val) => updateTone('emojis', val)}
                    />
                </div>
            </div>

            {/* System Instructions */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                    System Instructions
                </label>
                <div className="bg-white rounded-[1.5rem] p-1 shadow-sm border border-stone-200">
                    <TextArea 
                        value={context.systemInstructions}
                        onChange={(e) => updateInstructions(e.target.value)}
                        placeholder="e.g. Always sign off with 'Cheers', prefer minimal layouts..."
                        className="!bg-transparent !border-none !shadow-none min-h-[120px] text-sm"
                    />
                </div>
                <p className="text-xs text-stone-400 px-2">
                    These instructions are prepended to every request you make.
                </p>
            </div>

            {/* File Upload */}
            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                        Knowledge Base
                    </label>
                    <span className="text-xs font-medium text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
                        {context.files.length} / 20 Files
                    </span>
                </div>

                <div 
                    className={`
                        relative border-2 border-dashed rounded-[1.5rem] p-8 transition-all duration-200 text-center
                        ${dragActive ? 'border-pink-500 bg-pink-50 scale-[1.01]' : 'border-stone-200 bg-white hover:border-stone-300'}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        multiple 
                        accept=".pdf,.txt,.html,.md,image/*" 
                        className="hidden" 
                        onChange={handleFileSelect}
                    />
                    
                    <div className="flex flex-col items-center gap-3 pointer-events-none">
                        <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center text-stone-400">
                            <Upload size={24} />
                        </div>
                        <div>
                            <p className="font-medium text-stone-900">Click to upload or drag and drop</p>
                            <p className="text-xs text-stone-400 mt-1">PDF, TXT, HTML, Images (max 20)</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>

                {/* File List */}
                <div className="grid grid-cols-1 gap-2 mt-4">
                    {context.files.map((file) => (
                        <div key={file.id} className="group flex items-center justify-between p-3 bg-white border border-stone-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0 overflow-hidden relative">
                                    {file.type.startsWith('image/') ? (
                                        <img src={file.content} alt={file.name} className="w-full h-full object-cover" />
                                    ) : (
                                        getFileIcon(file.type)
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-stone-700 truncate">{file.name}</span>
                                    <span className="text-[10px] text-stone-400">{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => removeFile(file.id)}
                                className="p-2 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {context.files.length === 0 && (
                        <div className="text-center py-8 text-stone-400 text-sm italic">
                            No files added yet.
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Visualizer */}
        <div className="w-full lg:w-1/2 p-6 lg:p-8 bg-stone-100/50 border-l border-stone-100 h-full">
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                        Context Visualizer
                    </label>
                </div>
                <div className="flex-grow relative h-full">
                    <ContextVisualizer files={context.files} />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};