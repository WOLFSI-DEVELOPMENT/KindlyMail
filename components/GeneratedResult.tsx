import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { Message, GeneratedEmail } from '../types';
import { ArrowUp, ChevronLeft, Download, Eye, Layout, Monitor, Moon, Share2, Smartphone, Copy, FileCode, Check, Save, MessageSquare, Edit3 } from 'lucide-react';
import { ShareModal } from './ShareModal';
import { VisualEditor } from './VisualEditor';

interface WorkspaceViewProps {
  initialDraft: GeneratedEmail;
  messages: Message[];
  onRefine: (prompt: string) => void;
  isGenerating: boolean;
  onBack: () => void;
  onSave?: (draft: GeneratedEmail) => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ 
  initialDraft, 
  messages, 
  onRefine, 
  isGenerating,
  onBack,
  onSave
}) => {
  const [draft, setDraft] = useState<GeneratedEmail>(initialDraft);
  const [prompt, setPrompt] = useState('');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Sidebar Modes: 'chat' | 'editor'
  const [sidebarMode, setSidebarMode] = useState<'chat' | 'editor'>('chat');
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  
  // Export Menu State
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const exportBtnRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(initialDraft);
  }, [initialDraft]);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle click outside for export menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportBtnRef.current && !exportBtnRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Iframe Interaction Logic ---

  // Inject styles for selection highlighting
  const injectSelectionStyles = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    
    if (!doc.getElementById('kindly-editor-styles')) {
        const style = doc.createElement('style');
        style.id = 'kindly-editor-styles';
        style.textContent = `
            .kindly-selected {
                outline: 2px solid #ec4899 !important;
                outline-offset: -2px;
                cursor: pointer;
            }
            .kindly-hover:not(.kindly-selected) {
                outline: 1px dashed #ec4899 !important;
                cursor: pointer;
            }
            body {
                transition: none !important; /* Prevent lag on resize */
            }
        `;
        doc.head.appendChild(style);
    }
  };

  // Handle Iframe Load
  const handleIframeLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    injectSelectionStyles();

    // Remove existing listeners to prevent duplicates
    const newBody = doc.body.cloneNode(true) as HTMLElement;
    doc.body.parentNode?.replaceChild(newBody, doc.body);

    // Re-attach listener
    doc.body.addEventListener('click', (e) => {
        if (sidebarMode !== 'editor') return;
        
        e.preventDefault();
        e.stopPropagation();

        // Remove prev selection
        const prev = doc.querySelector('.kindly-selected');
        if (prev) prev.classList.remove('kindly-selected');

        // Add new selection
        const target = e.target as HTMLElement;
        if (target && target !== doc.body) {
            target.classList.add('kindly-selected');
            setSelectedElement(target);
        } else {
            setSelectedElement(null);
        }
    });

    // Hover effect
    doc.body.addEventListener('mouseover', (e) => {
        if (sidebarMode !== 'editor') return;
        const target = e.target as HTMLElement;
        if (target && target !== doc.body) {
            target.classList.add('kindly-hover');
        }
    });

    doc.body.addEventListener('mouseout', (e) => {
        if (sidebarMode !== 'editor') return;
        const target = e.target as HTMLElement;
        if (target) {
            target.classList.remove('kindly-hover');
        }
    });
  };

  // Sync editor changes back to draft state
  const handleEditorUpdate = () => {
      if (iframeRef.current?.contentDocument) {
          // Serialize the current DOM state to the draft body
          // We must clone it to avoid removing the selection classes in the live view
          // But actually we DO want to remove selection classes from the saved HTML
          
          const doc = iframeRef.current.contentDocument;
          
          // Temporary cleanup for serialization
          const prevSelection = doc.querySelector('.kindly-selected');
          if (prevSelection) prevSelection.classList.remove('kindly-selected');
          
          // Remove injected style tag from serialization if possible
          const styleTag = doc.getElementById('kindly-editor-styles');
          const styleContent = styleTag?.textContent;
          if (styleTag) styleTag.textContent = ''; // Clear it momentarily

          const newHtml = doc.documentElement.outerHTML;
          
          // Restore
          if (prevSelection) prevSelection.classList.add('kindly-selected');
          if (styleTag && styleContent) styleTag.textContent = styleContent;

          setDraft(prev => ({ ...prev, body: newHtml }));
      }
  };
  
  // Re-inject styles if mode changes to editor
  useEffect(() => {
      if (sidebarMode === 'editor') {
          handleIframeLoad();
      } else {
          // Clear selection when leaving editor
          setSelectedElement(null);
          const doc = iframeRef.current?.contentDocument;
          const prev = doc?.querySelector('.kindly-selected');
          if (prev) prev.classList.remove('kindly-selected');
      }
  }, [sidebarMode]);


  // --- Standard Handlers ---

  const handleSend = () => {
    if (prompt.trim()) {
        onRefine(prompt);
        setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
      }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(draft.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([draft.body], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.subject.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'email_draft'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleSave = () => {
    if (onSave) {
        setIsSaving(true);
        // Ensure we save the latest visual edits
        if (sidebarMode === 'editor') handleEditorUpdate();
        onSave(draft);
        setTimeout(() => setIsSaving(false), 1000); // Visual feedback duration
    }
  };

  return (
    <div className="flex h-full bg-stone-50 overflow-hidden font-sans">
      
      {/* Sidebar - Chat / Editor Interface */}
      <div className="w-full md:w-[360px] flex flex-col bg-white border-r border-stone-200 z-10 shadow-xl shadow-stone-200/20 transition-all duration-300">
        
        {/* Sidebar Header & Navigation */}
        <div className="shrink-0">
            <div className="h-14 flex items-center px-4 border-b border-stone-100">
                <button onClick={onBack} className="p-2 -ml-2 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors flex items-center gap-2">
                    <div className="w-7 h-7 bg-stone-100 rounded-lg flex items-center justify-center">
                        <ChevronLeft className="text-stone-600" size={16} />
                    </div>
                    <span className="font-bold text-stone-900 tracking-tight text-xs uppercase">Back</span>
                </button>
            </div>

            {/* Mode Toggle Tabs */}
            <div className="flex p-2 gap-1 bg-stone-50 border-b border-stone-100">
                <button 
                    onClick={() => setSidebarMode('chat')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${sidebarMode === 'chat' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:bg-stone-100'}`}
                >
                    <MessageSquare size={16} /> AI Chat
                </button>
                <button 
                    onClick={() => setSidebarMode('editor')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${sidebarMode === 'editor' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:bg-stone-100'}`}
                >
                    <Edit3 size={16} /> Visual Editor
                </button>
            </div>
        </div>

        {/* --- CHAT MODE CONTENT --- */}
        {sidebarMode === 'chat' && (
            <>
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`
                                max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                                ${msg.role === 'user' 
                                    ? 'bg-stone-900 text-white rounded-br-sm' 
                                    : 'bg-stone-50 border border-stone-100 text-stone-700 shadow-sm rounded-bl-sm'}
                            `}>
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-stone-300 px-1">
                                {msg.role === 'user' ? 'You' : 'Gemini'}
                            </span>
                        </div>
                    ))}
                    {isGenerating && (
                        <div className="flex items-start gap-2 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-500 rounded-full animate-spin"></div>
                            </div>
                            <div className="bg-stone-50 border border-stone-100 px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-stone-400 shadow-sm">
                                Generating...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white shrink-0 border-t border-stone-100">
                    <div className="relative bg-white border border-stone-200 shadow-sm rounded-[1.5rem] focus-within:ring-2 focus-within:ring-stone-100 focus-within:border-stone-300 transition-all">
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe changes (e.g. 'Make the button blue')..."
                            className="w-full bg-transparent border-none text-sm text-stone-900 placeholder-stone-400 p-4 pb-12 focus:ring-0 resize-none min-h-[50px] max-h-[120px] rounded-[1.5rem]"
                            disabled={isGenerating}
                        />
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center px-2 pb-1">
                            <div className="flex gap-2 text-stone-400">
                                <Layout size={16} className="hover:text-stone-600 cursor-pointer" />
                            </div>
                            <button 
                                onClick={handleSend}
                                disabled={!prompt.trim() || isGenerating}
                                className="bg-stone-900 text-white rounded-full p-2 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ArrowUp size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )}

        {/* --- EDITOR MODE CONTENT --- */}
        {sidebarMode === 'editor' && (
            <VisualEditor 
                selectedElement={selectedElement}
                onUpdate={handleEditorUpdate}
            />
        )}
      </div>

      {/* Main Preview Area */}
      <div className="flex-grow flex flex-col h-full overflow-hidden relative bg-stone-100/50">
          
          {/* Top Bar */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
              <div className="flex items-center gap-4">
                  <span className="font-medium text-sm text-stone-600 truncate max-w-[200px]">{draft.subject}</span>
                  <div className="h-4 w-px bg-stone-200"></div>
                  <div className="flex bg-stone-100 rounded-lg p-1">
                      <button 
                        onClick={() => setViewMode('desktop')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                      >
                          <Monitor size={14} />
                      </button>
                      <button 
                        onClick={() => setViewMode('mobile')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                      >
                          <Smartphone size={14} />
                      </button>
                  </div>
              </div>
              
              <div className="flex items-center gap-2">
                  {onSave && (
                    <Button 
                        variant="secondary" 
                        className="!py-2 !px-4 text-xs" 
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <Check size={14} className="mr-2" /> : <Save size={14} className="mr-2" />} 
                        {isSaving ? 'Saved' : 'Save'}
                    </Button>
                  )}
                  <Button variant="ghost" className="!p-2">
                      <Eye size={18} />
                  </Button>
                  <Button variant="secondary" className="!py-2 !px-4 text-xs" onClick={() => setIsShareOpen(true)}>
                      <Share2 size={14} className="mr-2" /> Share
                  </Button>
                  
                  {/* Export Dropdown */}
                  <div className="relative" ref={exportBtnRef}>
                    <Button 
                        className="!py-2 !px-4 text-xs bg-black" 
                        onClick={() => setShowExportMenu(!showExportMenu)}
                    >
                        <Download size={14} className="mr-2" /> Export
                    </Button>
                    
                    {showExportMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <button 
                                onClick={handleCopyCode}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-50 rounded-lg transition-colors text-left"
                            >
                                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                {copied ? 'Copied!' : 'Copy HTML'}
                            </button>
                            <button 
                                onClick={handleDownloadHtml}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-50 rounded-lg transition-colors text-left"
                            >
                                <FileCode size={14} />
                                Download .html
                            </button>
                        </div>
                    )}
                  </div>
              </div>
          </div>

          {/* Preview Canvas */}
          <div className="flex-grow overflow-y-auto p-8 flex justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
              <div 
                className={`
                    bg-white shadow-2xl shadow-stone-200/60 rounded-xl overflow-hidden transition-all duration-500 ease-in-out
                    ${viewMode === 'desktop' ? 'w-full max-w-[800px] min-h-[600px]' : 'w-[375px] min-h-[667px]'}
                    ${sidebarMode === 'editor' ? 'ring-2 ring-stone-900 ring-offset-4 ring-offset-stone-100' : ''}
                `}
              >
                  {/* Iframe Preview */}
                  <iframe 
                    ref={iframeRef}
                    srcDoc={draft.body}
                    title="Email Preview"
                    className="w-full h-full min-h-[600px] border-none"
                    sandbox="allow-same-origin allow-scripts"
                    onLoad={handleIframeLoad}
                  />
              </div>
          </div>

          {sidebarMode === 'editor' && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-4 py-2 rounded-full shadow-lg text-xs font-medium animate-in fade-in slide-in-from-bottom-4 pointer-events-none">
                  Click elements in preview to edit
              </div>
          )}

      </div>

      <ShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        emailHtml={draft.body}
        subject={draft.subject}
      />
    </div>
  );
};