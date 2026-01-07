import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, Heart, ArrowRightLeft, ExternalLink, Plus, Key, Mail, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { KindlyMailSdk } from '../services/kindlyMailSdk';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailHtml: string;
  subject: string;
}

type IntegrationId = 'gmail' | 'klaviyo' | 'brevo' | 'mailchimp';

interface Integration {
  id: IntegrationId;
  name: string;
  logo: string;
  apiKeyUrl: string;
  bg: string;
  description: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    logo: 'https://cdn.worldvectorlogo.com/logos/gmail-icon.svg',
    apiKeyUrl: '#',
    bg: '#ffffff',
    description: 'Compose directly in Gmail'
  },
  {
    id: 'klaviyo',
    name: 'Klaviyo',
    logo: 'https://cdn.worldvectorlogo.com/logos/klaviyo.svg',
    apiKeyUrl: 'https://www.klaviyo.com/settings/account/api-keys',
    bg: '#ffffff',
    description: 'Marketing Automation'
  },
  {
    id: 'brevo',
    name: 'Brevo',
    logo: 'https://corp-backend.brevo.com/wp-content/uploads/2023/04/Brevo-Logo-1.svg',
    apiKeyUrl: 'https://app.brevo.com/settings/keys/api',
    bg: '#0F6938',
    description: 'CRM Suite'
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    logo: 'https://cdn.worldvectorlogo.com/logos/mailchimp-freddie-icon.svg',
    apiKeyUrl: 'https://admin.mailchimp.com/account/api/',
    bg: '#FFE01B',
    description: 'Email Marketing'
  }
];

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, emailHtml, subject }) => {
  const [view, setView] = useState<'selection' | 'config'>('selection');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  
  // Generic State
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // API Key State (for standard integrations)
  const [apiKey, setApiKey] = useState('');
  const [campaignName, setCampaignName] = useState('');

  // Gmail Specific State
  const [gmailToken, setGmailToken] = useState('');
  const [gmailTo, setGmailTo] = useState('');
  const [gmailCc, setGmailCc] = useState('');
  const [gmailSubject, setGmailSubject] = useState(subject);

  useEffect(() => {
    setGmailSubject(subject);
    setCampaignName(subject);
    
    // Load Gmail token
    const savedToken = localStorage.getItem('kindlymail_extension_token');
    if (savedToken) setGmailToken(savedToken);
  }, [subject, isOpen]);

  const handleClose = () => {
    onClose();
    // Reset state after transition
    setTimeout(() => {
        setView('selection');
        setSelectedIntegration(null);
        setApiKey('');
        setCampaignName('');
        setStatus('idle');
        setErrorMessage('');
        setGmailTo('');
        setGmailCc('');
    }, 300);
  };

  if (!isOpen) return null;

  const handleSelect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setView('config');
  };

  const handleBack = () => {
    setView('selection');
    setSelectedIntegration(null);
    setErrorMessage('');
    setStatus('idle');
  };

  const handleSend = async () => {
    setStatus('sending');
    setErrorMessage('');

    if (selectedIntegration?.id === 'gmail') {
        if (!gmailToken || !gmailTo) {
            setErrorMessage('Token and Recipient are required.');
            setStatus('error');
            return;
        }

        try {
            localStorage.setItem('kindlymail_extension_token', gmailToken);
            KindlyMailSdk.init(gmailToken);
            await KindlyMailSdk.compose({
                to: gmailTo,
                cc: gmailCc,
                subject: gmailSubject,
                html: emailHtml
            });
            setStatus('success');
            setTimeout(() => {
                // Keep success state briefly
            }, 2000);
        } catch (e: any) {
            console.error(e);
            setStatus('error');
            setErrorMessage(e.message || "Failed to trigger extension. Ensure the Chrome extension is installed and your token is correct.");
        }
        return;
    }

    // Standard API Integrations (Mocked)
    if (!apiKey) {
        setErrorMessage('API Key is required.');
        setStatus('error');
        return;
    }

    setTimeout(() => {
        console.log(`Sending to ${selectedIntegration?.name}...`, { apiKey, campaignName, html: emailHtml });
        setStatus('success');
    }, 1500);
  };

  const isFormValid = () => {
      if (selectedIntegration?.id === 'gmail') {
          return gmailToken.length > 0 && gmailTo.length > 0;
      }
      return apiKey.length > 0;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden animate-in zoom-in-95 fade-in duration-300 ease-out flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors z-10 p-2 hover:bg-stone-50 rounded-full"
        >
            <X size={20} />
        </button>

        {/* View: Selection */}
        {view === 'selection' && (
            <div className="p-8">
                <h2 className="text-xl font-bold text-stone-900 mb-2">Export Integration</h2>
                <p className="text-sm text-stone-500 mb-6">Choose a platform to send your email template to.</p>
                
                <div className="space-y-3">
                    {INTEGRATIONS.map((integration) => (
                        <button
                            key={integration.id}
                            onClick={() => handleSelect(integration)}
                            className="w-full flex items-center gap-4 p-4 rounded-xl border border-stone-200 hover:border-black/20 hover:bg-stone-50 transition-all group text-left shadow-sm hover:shadow-md"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white border border-stone-100 flex items-center justify-center p-2.5 shrink-0 shadow-sm">
                                <img src={integration.logo} alt={integration.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-stone-900">{integration.name}</h3>
                                <p className="text-xs text-stone-500">{integration.description}</p>
                            </div>
                            <div className="text-stone-300 group-hover:text-stone-900 transition-colors">
                                <ChevronLeft size={20} className="rotate-180" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* View: Config */}
        {view === 'config' && selectedIntegration && (
            <div className="p-8 flex flex-col h-full overflow-y-auto">
                
                {/* Header */}
                <div className="text-center mb-8 relative">
                    <button 
                        onClick={handleBack} 
                        className="absolute top-0 left-0 text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                        <ChevronLeft size={16} /> Back
                    </button>

                    <div className="flex items-center justify-center gap-4 mt-8 mb-4">
                        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-md">
                            <Heart fill="white" className="text-white" size={24} />
                        </div>
                        <div className="text-stone-300">
                            <ArrowRightLeft size={20} />
                        </div>
                        <div className="w-14 h-14 bg-white border border-stone-200 rounded-2xl flex items-center justify-center p-3 shadow-md">
                             <img src={selectedIntegration.logo} alt={selectedIntegration.name} className="w-full h-full object-contain" />
                        </div>
                    </div>

                    <h2 className="text-lg font-bold text-stone-900">
                        {status === 'success' ? 'Sent Successfully!' : `Connect to ${selectedIntegration.name}`}
                    </h2>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <p className="text-stone-600 text-sm mb-6">
                            {selectedIntegration.id === 'gmail' 
                                ? 'Check your open tabs. A new Gmail compose window has been created.'
                                : 'Your template has been exported successfully.'}
                        </p>
                        <button onClick={handleClose} className="bg-stone-100 text-stone-900 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-stone-200">
                            Done
                        </button>
                    </div>
                ) : (
                    <div className="w-full space-y-5">
                        
                        {/* Gmail Specific Form */}
                        {selectedIntegration.id === 'gmail' ? (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-stone-500 uppercase flex justify-between">
                                        <span>Extension Token</span>
                                        <span className="text-stone-300 text-[10px] cursor-help" title="Click the KindlyMail extension icon in your browser toolbar">Where is this?</span>
                                    </label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                                        <input 
                                            type="password"
                                            value={gmailToken}
                                            onChange={(e) => setGmailToken(e.target.value)}
                                            placeholder="Paste token from Chrome extension"
                                            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 font-mono transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-stone-500 uppercase">To</label>
                                        <input 
                                            type="text"
                                            value={gmailTo}
                                            onChange={(e) => setGmailTo(e.target.value)}
                                            placeholder="email@example.com"
                                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-stone-500 uppercase">CC</label>
                                        <input 
                                            type="text"
                                            value={gmailCc}
                                            onChange={(e) => setGmailCc(e.target.value)}
                                            placeholder="Optional"
                                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-stone-500 uppercase">Subject</label>
                                    <input 
                                        type="text"
                                        value={gmailSubject}
                                        onChange={(e) => setGmailSubject(e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                                    />
                                </div>
                            </>
                        ) : (
                            /* Standard Integration Form */
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-stone-500 uppercase">API Key</label>
                                    <input 
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder={`Enter ${selectedIntegration.name} API Key`}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-stone-500 uppercase">Campaign Name</label>
                                    <input 
                                        type="text"
                                        value={campaignName}
                                        onChange={(e) => setCampaignName(e.target.value)}
                                        placeholder="My Awesome Campaign"
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                                    />
                                </div>
                            </>
                        )}

                        {/* Error Message */}
                        {status === 'error' && (
                            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Action Button */}
                        <button 
                            onClick={handleSend}
                            disabled={!isFormValid() || status === 'sending'}
                            className={`
                                w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-4
                                ${selectedIntegration.id === 'gmail' 
                                    ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                                    : 'bg-black hover:bg-stone-800 shadow-stone-200'
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                            `}
                        >
                            {status === 'sending' ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    {selectedIntegration.id === 'gmail' ? <Mail size={18} /> : <Plus size={18} />}
                                    <span>{selectedIntegration.id === 'gmail' ? 'Compose in Gmail' : 'Connect & Export'}</span>
                                </>
                            )}
                        </button>

                        {/* Footer Link */}
                        {selectedIntegration.apiKeyUrl !== '#' && (
                            <div className="text-center pt-2">
                                <a 
                                    href={selectedIntegration.apiKeyUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-400 hover:text-stone-600 uppercase tracking-wide transition-colors"
                                >
                                    Where to find API Key <ExternalLink size={10} />
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}

      </div>
    </div>
  );
};