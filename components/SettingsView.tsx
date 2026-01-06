import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, FileText, Image as ImageIcon, FileCode, File, Trash2, Cpu, ChevronDown, Check, Copy, Key, Mic2, Sparkles, RefreshCw } from 'lucide-react';
import { UploadedFile, PersonalContext, ToneSettings, VoiceFingerprint } from '../types';
import { ContextVisualizer } from './ContextVisualizer';
import { TextArea, Input } from './ui/Input'; 
import { Button } from './ui/Button';
import { analyzeBrandVoice } from '../services/geminiService';

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
          {options.find(o => o.value === value)?.label || value}
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
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
  const [apiKey, setApiKey] = useState(localStorage.getItem('kindlymail_gemini_key') || '');
  const [showKey, setShowKey] = useState(false);
  
  // Voice Scanner State
  const [voiceInput, setVoiceInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setApiKey(val);
      localStorage.setItem('kindlymail_gemini_key', val);
  };

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

  const updateModel = (val: string) => {
      onUpdateContext({
          ...context,
          model: val
      });
  };

  const handleScanVoice = async () => {
      if (!voiceInput.trim()) return;
      setIsScanning(true);
      try {
          const emails = voiceInput.split('\n\n').filter(e => e.trim().length > 0);
          const fingerprint = await analyzeBrandVoice(emails);
          onUpdateContext({
              ...context,
              voiceFingerprint: fingerprint
          });
          setScannerOpen(false);
          setVoiceInput('');
      } catch (e) {
          alert("Failed to analyze voice. Please check API Key and try again.");
      }
      setIsScanning(false);
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
        <div className="w-full lg:w-1/2 h-full overflow-y-auto p-6 lg:p-8 custom-scrollbar space-y-8 pb-20 scroll-smooth overscroll-contain">
            
            {/* API Key Section */}
            <div className="space-y-4">
                <div>
                   <label className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                       <Key size={14} /> Gemini API Configuration
                   </label>
                   <p className="text-xs text-stone-500 mt-1">
                      Required for the app to function. Your key is stored locally on your device.
                   </p>
                </div>
                
                <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-stone-200">
                    <div className="relative">
                        <input 
                            type={showKey ? "text" : "password"}
                            value={apiKey}
                            onChange={handleApiKeyChange}
                            placeholder="AIzaSy..."
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 font-mono"
                        />
                        <button 
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                        >
                            {showKey ? "HIDE" : "SHOW"}
                        </button>
                    </div>
                    
                    {/* Model Selector */}
                    <div className="mt-6 pt-6 border-t border-stone-100">
                        <ToneDropdown 
                            label="AI Model"
                            value={context.model || 'gemini-3-flash-preview'}
                            options={[
                                { label: 'Gemini 3.0 Flash', value: 'gemini-3-flash-preview', description: 'Recommended: Fast and intelligent' },
                                { label: 'Gemini 3.0 Pro', value: 'gemini-3-pro-preview', description: 'Best for complex reasoning' },
                                { label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash-preview', description: 'Efficient and capable' },
                                { label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro-preview', description: 'Strong reasoning capabilities' },
                                { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash', description: 'Standard 2.0 model' },
                                { label: 'Gemini 2.0 Pro', value: 'gemini-2.0-pro-exp-02-05', description: 'Experimental 2.0 Pro' },
                                { label: 'Gemini 2.0 Flash Lite', value: 'gemini-2.0-flash-lite-preview-02-05', description: 'Cost effective and fast' },
                            ]}
                            onChange={updateModel}
                        />
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline">
                            Get API Key →
                        </a>
                        {apiKey && <span className="text-xs text-green-600 font-bold flex items-center gap-1"><Check size={12} /> Saved</span>}
                    </div>
                </div>
            </div>

            {/* Brand Voice Scanner (NEW) */}
            <div className="space-y-4">
                <div>
                   <label className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                        <Mic2 size={14} className="text-pink-500" />
                        Brand Voice Scanner
                   </label>
                   <p className="text-xs text-stone-500 mt-1">
                      Paste examples of your past emails to create a unique "Tone Fingerprint".
                   </p>
                </div>

                <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-stone-200 relative overflow-hidden">
                    {context.voiceFingerprint ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">
                                    <Sparkles size={14} /> Voice Active
                                </div>
                                <button 
                                    onClick={() => onUpdateContext({...context, voiceFingerprint: undefined})}
                                    className="text-xs text-stone-400 hover:text-red-500 flex items-center gap-1"
                                >
                                    <Trash2 size={12} /> Reset
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                                    <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wide block mb-1">Summary</span>
                                    <p className="text-sm text-stone-800 leading-relaxed font-medium">"{context.voiceFingerprint.summary}"</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                                        <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wide block mb-1">Keywords</span>
                                        <div className="flex flex-wrap gap-1">
                                            {context.voiceFingerprint.keywords.map(k => (
                                                <span key={k} className="text-[10px] bg-white border border-stone-200 px-1.5 py-0.5 rounded text-stone-600">{k}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                                        <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wide block mb-1">Signature</span>
                                        <p className="text-xs text-stone-700">{context.voiceFingerprint.signatureStyle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                                <FileText size={24} />
                            </div>
                            <h3 className="font-bold text-stone-900 mb-2">No Voice Detected</h3>
                            <p className="text-xs text-stone-500 mb-6 max-w-xs mx-auto">
                                KindlyMail is using generic defaults. Scan your previous emails to personalize the output.
                            </p>
                            <Button onClick={() => setScannerOpen(true)} className="w-full">
                                <Sparkles size={16} className="mr-2" /> Start Voice Scan
                            </Button>
                        </div>
                    )}

                    {/* Scanner Modal Overlay */}
                    {scannerOpen && (
                        <div className="absolute inset-0 bg-white z-10 flex flex-col p-6 animate-in slide-in-from-bottom-10 duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-stone-900">Paste 3+ Past Emails</h3>
                                <button onClick={() => setScannerOpen(false)} className="text-stone-400 hover:text-stone-900"><X size={20}/></button>
                            </div>
                            <textarea 
                                value={voiceInput}
                                onChange={(e) => setVoiceInput(e.target.value)}
                                placeholder={`Subject: Hi there\nBody: Just checking in on...\n\n---\n\nSubject: Follow up\nBody: ...`}
                                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/5 mb-4"
                            />
                            <Button 
                                onClick={handleScanVoice}
                                isLoading={isScanning}
                                disabled={!voiceInput.trim() || isScanning}
                                className="w-full"
                            >
                                Analyze Tone
                            </Button>
                        </div>
                    )}
                </div>
            </div>

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