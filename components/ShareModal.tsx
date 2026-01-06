import React, { useState } from 'react';
import { X, ChevronLeft, Heart, ArrowRightLeft, ExternalLink, Plus } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailHtml: string;
  subject: string;
}

type IntegrationId = 'klaviyo' | 'brevo' | 'mailchimp';

interface Integration {
  id: IntegrationId;
  name: string;
  logo: string;
  apiKeyUrl: string;
  bg: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'klaviyo',
    name: 'Klaviyo',
    logo: 'https://cdn.worldvectorlogo.com/logos/klaviyo.svg',
    apiKeyUrl: 'https://www.klaviyo.com/settings/account/api-keys',
    bg: '#ffffff'
  },
  {
    id: 'brevo',
    name: 'Brevo',
    logo: 'https://corp-backend.brevo.com/wp-content/uploads/2023/04/Brevo-Logo-1.svg',
    apiKeyUrl: 'https://app.brevo.com/settings/keys/api',
    bg: '#0F6938'
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    logo: 'https://cdn.worldvectorlogo.com/logos/mailchimp-freddie-icon.svg',
    apiKeyUrl: 'https://admin.mailchimp.com/account/api/',
    bg: '#FFE01B'
  }
];

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, emailHtml, subject }) => {
  const [view, setView] = useState<'selection' | 'config'>('selection');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [submitterId, setSubmitterId] = useState(''); // Added to match reference
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleClose = () => {
    onClose();
    // Reset state after transition
    setTimeout(() => {
        setView('selection');
        setSelectedIntegration(null);
        setApiKey('');
        setSubmitterId('');
        setStatus('idle');
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
    setApiKey('');
    setSubmitterId('');
  };

  const handleSend = async () => {
    if (!apiKey || !selectedIntegration) return;

    setStatus('sending');
    
    // Simulate API call
    setTimeout(() => {
        console.log(`Sending to ${selectedIntegration.name}...`, { apiKey, submitterId, subject, html: emailHtml });
        setStatus('success');
        setTimeout(() => {
            setStatus('idle');
            handleClose();
        }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-[500px] overflow-hidden animate-in zoom-in-95 fade-in duration-300 ease-out flex flex-col">
        
        {/* Close Button */}
        <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors z-10"
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
                            className="w-full flex items-center gap-4 p-4 rounded-xl border border-stone-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all group text-left"
                        >
                            <div className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center p-2 shrink-0">
                                <img src={integration.logo} alt={integration.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-semibold text-stone-900">{integration.name}</h3>
                            </div>
                            <div className="text-stone-300 group-hover:text-blue-500">
                                <ChevronLeft size={20} className="rotate-180" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* View: Config (Matching Reference) */}
        {view === 'config' && selectedIntegration && (
            <div className="p-8 md:p-10 flex flex-col items-center text-center">
                
                {/* Back Button (Absolute) */}
                <button 
                    onClick={handleBack} 
                    className="absolute top-4 left-4 text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1 text-sm font-medium"
                >
                    <ChevronLeft size={16} /> Back
                </button>

                {/* Connection Visual */}
                <div className="flex items-center gap-6 mb-6 mt-2">
                    {/* KindlyMail Logo */}
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-sm">
                        <Heart fill="white" className="text-white" size={32} />
                    </div>
                    
                    {/* Arrows */}
                    <div className="text-stone-300">
                        <ArrowRightLeft size={24} />
                    </div>

                    {/* Integration Logo */}
                    <div className="w-16 h-16 bg-white border border-stone-200 rounded-2xl flex items-center justify-center p-3 shadow-sm">
                         <img src={selectedIntegration.logo} alt={selectedIntegration.name} className="w-full h-full object-contain" />
                    </div>
                </div>

                <h2 className="text-xl font-bold text-stone-900 mb-2">
                    Connecting KindlyMail to {selectedIntegration.name}
                </h2>
                
                <p className="text-sm text-stone-500 mb-8 max-w-xs leading-relaxed">
                    Enter your API credentials below to authorize the secure transfer of your email template.
                </p>

                {/* Form */}
                <div className="w-full space-y-5 text-left">
                    <div className="space-y-1.5">
                        <div className="flex justify-between">
                            <label className="text-sm font-semibold text-stone-900">API Key</label>
                        </div>
                        <input 
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter API Key"
                            className="w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-stone-900">Campaign Name (Optional)</label>
                        <input 
                            type="text"
                            value={submitterId}
                            onChange={(e) => setSubmitterId(e.target.value)}
                            placeholder={subject || "Enter Campaign Name"}
                            className="w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    <button 
                        onClick={handleSend}
                        disabled={!apiKey || status !== 'idle'}
                        className={`
                            w-full py-3 rounded-lg font-semibold text-white shadow-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2
                            ${status === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
                            ${(!apiKey || status === 'sending') ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}
                        `}
                    >
                        {status === 'sending' ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : status === 'success' ? (
                            <span>Connected & Sent!</span>
                        ) : (
                            <>
                                <Plus size={18} />
                                <span>Connect</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Footer Disclaimer */}
                <div className="mt-8 pt-6 border-t border-stone-100 w-full text-center">
                    <p className="text-xs text-stone-400 leading-relaxed px-4">
                        By clicking Connect, you authorize KindlyMail to create drafts in your {selectedIntegration.name} account. 
                        You can revoke this access at any time in your {selectedIntegration.name} settings.
                    </p>
                    <a 
                        href={selectedIntegration.apiKeyUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-4 hover:underline"
                    >
                        Read documentation <ExternalLink size={10} />
                    </a>
                </div>

            </div>
        )}

      </div>
    </div>
  );
};