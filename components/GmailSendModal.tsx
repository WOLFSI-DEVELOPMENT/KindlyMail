import React, { useState, useEffect } from 'react';
import { X, Mail, Key, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { KindlyMailSdk } from '../services/kindlyMailSdk';

interface GmailSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  subject: string;
}

export const GmailSendModal: React.FC<GmailSendModalProps> = ({ isOpen, onClose, html, subject: initialSubject }) => {
  const [token, setToken] = useState('');
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState(initialSubject);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('kindlymail_extension_token');
    if (savedToken) setToken(savedToken);
    setSubject(initialSubject);
  }, [initialSubject, isOpen]);

  const handleSend = async () => {
    if (!token || !to) return;
    
    setStatus('sending');
    setErrorMessage('');
    
    try {
      localStorage.setItem('kindlymail_extension_token', token);
      KindlyMailSdk.init(token);
      await KindlyMailSdk.compose({
        to,
        cc,
        subject,
        html
      });
      setStatus('success');
      setTimeout(() => {
          onClose();
          setStatus('idle');
      }, 3000);
    } catch (e: any) {
      console.error(e);
      setStatus('error');
      setErrorMessage(e.message || "Failed to trigger extension. Ensure the Chrome extension is installed and your token is correct.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                    <Mail size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-stone-900">Send to Gmail</h2>
                    <p className="text-xs text-stone-500">Via Chrome Extension</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-stone-900 transition-colors">
                <X size={20} />
            </button>
        </div>

        {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Opened in Gmail!</h3>
                <p className="text-stone-500 mt-2 text-sm">Check your open tabs. A new compose window has been created with your design.</p>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase flex justify-between">
                        <span>Extension Token</span>
                        <a href="#" className="text-blue-500 hover:underline cursor-help" title="Click the KindlyMail extension icon in your browser toolbar to copy your token.">Where do I find this?</a>
                    </label>
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                        <input 
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Paste token from extension popup"
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-mono"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">To</label>
                    <input 
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="recipient@example.com, another@example.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">CC (Optional)</label>
                    <input 
                        type="text"
                        value={cc}
                        onChange={(e) => setCc(e.target.value)}
                        placeholder="colleague@example.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Subject</label>
                    <input 
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                    />
                </div>

                {status === 'error' && (
                    <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg flex items-start gap-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <button 
                    onClick={handleSend}
                    disabled={!token || !to || status === 'sending'}
                    className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'sending' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    Compose in Gmail
                </button>
            </div>
        )}
      </div>
    </div>
  );
};