import React, { useState } from 'react';
import { HomeView } from './components/HomeView';
import { WorkspaceView } from './components/GeneratedResult';
import { TemplatesView } from './components/TemplatesView';
import { SettingsView } from './components/SettingsView';
import { CreationsView } from './components/CreationsView';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { BrandAssetsView } from './components/BrandAssetsView';
import { LegalView } from './components/LegalView';
import { OnboardingFlow, OnboardingData } from './components/OnboardingFlow'; // Import Onboarding
import { EmailState, ToneOption, Message, PersonalContext, GeneratedEmail, Creation, Template } from './types';
import { generateEmailDraft } from './services/geminiService';
import { Home, FolderHeart, Settings, Heart, LayoutTemplate, PanelLeftClose, PanelLeftOpen, Users } from 'lucide-react';

export default function App() {
  // Navigation State
  const [view, setView] = useState<'landing' | 'login' | 'onboarding' | 'app' | 'brand-assets' | 'legal'>('landing');

  // App Internal State
  const [activeTab, setActiveTab] = useState<'home' | 'templates' | 'creations' | 'settings' | 'community'>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Settings / Context State
  const [personalContext, setPersonalContext] = useState<PersonalContext>({
    systemInstructions: '',
    files: [],
    toneSettings: {
      warmth: 'Default',
      enthusiasm: 'Default',
      formatting: 'Default',
      emojis: 'Default'
    }
  });

  // Derived state from onboarding to pass down to HomeView
  const [initialBrandAssets, setInitialBrandAssets] = useState<{
      websiteUrl: string;
      brandColor: string;
  }>({ websiteUrl: '', brandColor: '#000000' });

  const [state, setState] = useState<EmailState>({
    recipient: '',
    topic: '',
    tone: ToneOption.Friendly,
    subject: '',
    body: '',
    isGenerating: false,
    generated: false,
    messages: []
  });

  // --- View Switching Logic ---

  if (view === 'landing') {
    return (
      <LandingPage 
        onGetStarted={() => setView('login')} 
        onLogin={() => setView('login')}
        onNavigate={(page) => setView(page)}
        onLoadTemplate={(template) => {
            // Load template and jump straight to editor
            setView('app');
            // Small timeout to ensure app view mounts before state update if needed, though React batches usually handle this.
            // Using logic similar to handleUseTemplate below.
            const aiResponse: Message = {
                role: 'model',
                content: `I've loaded the "${template.name}" template. Ready to customize!`,
                timestamp: Date.now()
            };
            
            setState({
                recipient: '',
                topic: 'Using Template',
                tone: ToneOption.Friendly,
                subject: template.subject,
                body: template.body,
                isGenerating: false,
                generated: true, // This forces WorkspaceView to render
                messages: [aiResponse]
            });
            setActiveTab('home');
        }}
      />
    );
  }

  if (view === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={() => setView('onboarding')} // Redirect to onboarding
        onBack={() => setView('landing')}
      />
    );
  }

  if (view === 'brand-assets') {
      return <BrandAssetsView onBack={() => setView('landing')} />;
  }

  if (view === 'legal') {
      return <LegalView onBack={() => setView('landing')} />;
  }

  // --- Onboarding Logic ---
  const handleOnboardingComplete = (data: OnboardingData) => {
      // 1. Update Personal Context with text context
      if (data.context) {
          setPersonalContext(prev => ({
              ...prev,
              systemInstructions: prev.systemInstructions 
                  ? `${prev.systemInstructions}\n\n${data.context}`
                  : data.context
          }));
      }

      // 2. Set initial brand assets for HomeView
      setInitialBrandAssets({
          websiteUrl: data.websiteUrl,
          brandColor: data.brandAssets.colors[0] || '#000000'
      });

      // 3. Navigate based on action
      if (data.action === 'template') {
          setActiveTab('templates');
      } else {
          setActiveTab('home');
      }

      // 4. Go to App
      setView('app');
  };

  if (view === 'onboarding') {
      return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // --- Main App Logic (view === 'app') ---

  const handleInitialGenerate = async (
    prompt: string, 
    imageUrl?: string | null, 
    websiteUrl?: string,
    brandLogo?: string | null,
    brandColor?: string,
    figmaUrl?: string,
    youtubeUrl?: string
  ) => {
    let content = prompt;
    
    // Add branding context to the prompt
    content += "\n\n--- BRANDING CONTEXT ---";
    
    if (brandLogo) {
      content += `\n[MANDATORY BRAND LOGO URL: ${brandLogo}]`;
      content += `\n(You MUST use this URL as the header logo of the email)`;
    }
    
    if (brandColor && brandColor !== '#000000') {
      content += `\n[MANDATORY PRIMARY COLOR: ${brandColor}]`;
      content += `\n(You MUST use this color for the main call-to-action buttons and key accents)`;
    }

    if (websiteUrl) {
      content += `\n[Reference Website: ${websiteUrl}]`;
      content += `\n(Please analyze this website to match its font style and general vibe, but prioritize the specific logo and color provided above if any)`;
    }

    if (figmaUrl) {
      content += `\n[Reference Figma Design: ${figmaUrl}]`;
      content += `\n(I have provided a Figma URL. Please analyze the layout structure implied by typical Figma wireframes or designs associated with this link if possible, or use standard best practices for high-fidelity conversion if direct API access is not available in this context)`;
    }

    if (youtubeUrl) {
      content += `\n[Reference YouTube Video: ${youtubeUrl}]`;
      content += `\n(Please analyze the content or topic of this YouTube video and create an email based on it. Use the 'googleSearch' tool to find more details about the video if needed.)`;
    }

    if (imageUrl) {
      content += `\n\n[Attached Content Image: ${imageUrl}]`;
      content += `\n(Use this uploaded image/screenshot as the PRIMARY design reference. Mimic the layout, spacing, and visual hierarchy shown in this screenshot)`;
    }

    const newMessages: Message[] = [
      { role: 'user', content: content, timestamp: Date.now() }
    ];
    
    setState(prev => ({ 
      ...prev, 
      isGenerating: true, 
      topic: prompt,
      messages: newMessages
    }));

    try {
      // Pass personalContext to the service
      const result = await generateEmailDraft(newMessages, undefined, personalContext);
      
      let replyContent = "I've drafted an email for you.";
      if (websiteUrl) replyContent += " I analyzed your website style.";
      if (brandLogo) replyContent += " I used your custom logo.";
      if (figmaUrl) replyContent += " I referenced your Figma design link.";
      if (youtubeUrl) replyContent += " I analyzed your YouTube video.";
      if (personalContext.files.length > 0) replyContent += ` I also referenced your ${personalContext.files.length} uploaded file(s).`;
      
      const aiResponse: Message = {
        role: 'model',
        content: replyContent + " How does it look?",
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        subject: result.subject,
        body: result.body,
        generated: true,
        isGenerating: false,
        messages: [...prev.messages, aiResponse]
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleRefine = async (refinementPrompt: string) => {
    const newMessages: Message[] = [
      ...state.messages,
      { role: 'user', content: refinementPrompt, timestamp: Date.now() }
    ];

    setState(prev => ({ 
      ...prev, 
      isGenerating: true, 
      messages: newMessages
    }));

    try {
      const currentDraft = { subject: state.subject, body: state.body };
      // Pass personalContext to the service
      const result = await generateEmailDraft(newMessages, currentDraft, personalContext);
      
      const aiResponse: Message = {
        role: 'model',
        content: "I've updated the draft based on your feedback.",
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        subject: result.subject,
        body: result.body,
        isGenerating: false,
        messages: [...newMessages, aiResponse]
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleBack = () => {
    // Removed confirmation for smoother UX
    setState({
        recipient: '',
        topic: '',
        tone: ToneOption.Friendly,
        subject: '',
        body: '',
        isGenerating: false,
        generated: false,
        messages: []
    });
    setActiveTab('home');
  };

  const handleUseTemplate = (subject: string, body: string) => {
    const aiResponse: Message = {
        role: 'model',
        content: "I've loaded the template for you. You can now customize it or ask me to make changes!",
        timestamp: Date.now()
    };
    
    setState({
        recipient: '',
        topic: 'Using Template',
        tone: ToneOption.Friendly,
        subject,
        body,
        isGenerating: false,
        generated: true,
        messages: [aiResponse]
    });
    // Switch to home view which will render WorkspaceView because generated=true
    setActiveTab('home');
  };

  // --- Creations Handlers ---
  
  const handleSaveCreation = (draft: GeneratedEmail) => {
    const newCreation: Creation = {
        id: Math.random().toString(36).substr(2, 9),
        subject: draft.subject,
        body: draft.body,
        snippet: draft.body.replace(/<[^>]*>/g, '').substring(0, 100) + '...',
        lastEdited: Date.now(),
        status: 'Draft',
        type: 'Email'
    };

    try {
        const stored = localStorage.getItem('kindlymail_creations');
        const creations = stored ? JSON.parse(stored) : [];
        creations.push(newCreation);
        localStorage.setItem('kindlymail_creations', JSON.stringify(creations));
        alert('Draft saved to My Creations!');
    } catch (e) {
        console.error("Failed to save creation", e);
        alert('Failed to save draft.');
    }
  };

  const handleLoadCreation = (creation: Creation) => {
    const aiResponse: Message = {
        role: 'model',
        content: `I've loaded your draft "${creation.subject}". What would you like to change?`,
        timestamp: Date.now()
    };
    
    setState({
        recipient: '',
        topic: 'Loaded Draft',
        tone: ToneOption.Friendly,
        subject: creation.subject,
        body: creation.body,
        isGenerating: false,
        generated: true,
        messages: [aiResponse]
    });
    setActiveTab('home');
  };

  const renderContent = () => {
    if (activeTab === 'templates') {
        return <TemplatesView onUseTemplate={handleUseTemplate} />;
    }

    if (activeTab === 'creations') {
      return (
        <CreationsView 
          onLoadCreation={handleLoadCreation}
          onCreateNew={() => {
              handleBack(); // Reset state
              setActiveTab('home');
          }}
        />
      );
    }

    if (activeTab === 'community') {
      return (
        <div className="h-full flex flex-col items-center justify-center text-stone-400">
           <div className="w-24 h-24 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mb-6">
              <Users size={40} className="text-stone-300" />
           </div>
           <h3 className="text-xl font-bold text-stone-900 mb-2 font-display">Community Hub</h3>
           <p className="font-medium max-w-sm text-center">Join thousands of creators sharing their best email templates and prompts. Coming soon.</p>
           
           <div className="mt-8 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-stone-200"></div>
              <div className="w-2 h-2 rounded-full bg-stone-200"></div>
              <div className="w-2 h-2 rounded-full bg-stone-200"></div>
           </div>
        </div>
      );
    }
    
    if (activeTab === 'settings') {
      return (
        <SettingsView 
          context={personalContext} 
          onUpdateContext={setPersonalContext} 
        />
      );
    }

    // Home Tab Logic
    if (!state.generated) {
      return (
        <HomeView 
          onGenerate={handleInitialGenerate} 
          isLoading={state.isGenerating} 
          onOpenSettings={() => setActiveTab('settings')}
          // Pass down initial assets from onboarding if available, otherwise it defaults in HomeView
        />
      );
    }

    return (
      <WorkspaceView 
        initialDraft={{ subject: state.subject, body: state.body }}
        messages={state.messages}
        onRefine={handleRefine}
        isGenerating={state.isGenerating}
        onBack={handleBack}
        onSave={handleSaveCreation}
      />
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#f3f4f6] p-3 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`${isSidebarCollapsed ? 'w-[80px]' : 'w-[240px]'} flex-shrink-0 flex flex-col py-6 transition-all duration-300 ease-in-out`}>
        {/* Branding */}
        <div className={`mb-10 flex items-center gap-3 transition-all duration-300 ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}>
           <img src="https://iili.io/fNbamD7.md.png" alt="KindlyMail Logo" className="w-8 h-8 rounded-lg shadow-sm shrink-0" />
           {!isSidebarCollapsed && (
             <span className="font-display font-bold text-xl text-stone-900 tracking-tight whitespace-nowrap overflow-hidden animate-in fade-in duration-300">
               KindlyMail
             </span>
           )}
        </div>

        {/* Navigation */}
        <div className={`space-y-2 ${isSidebarCollapsed ? 'px-2' : 'px-4'}`}>
             <button
                onClick={() => setActiveTab('home')}
                className={`w-full flex items-center gap-3 py-3 rounded-2xl transition-all duration-300 group ${
                  activeTab === 'home' 
                    ? 'bg-white shadow-sm shadow-stone-200 text-stone-900 font-semibold' 
                    : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'
                } ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}
                title={isSidebarCollapsed ? "Home" : ""}
             >
                <div className={`${activeTab === 'home' ? 'text-pink-500' : 'text-stone-400 group-hover:text-stone-600 transition-colors'}`}>
                    <Home size={20} />
                </div>
                {!isSidebarCollapsed && <span className="whitespace-nowrap overflow-hidden">Home</span>}
             </button>

             <button
                onClick={() => setActiveTab('templates')}
                className={`w-full flex items-center gap-3 py-3 rounded-2xl transition-all duration-300 group ${
                  activeTab === 'templates' 
                    ? 'bg-white shadow-sm shadow-stone-200 text-stone-900 font-semibold' 
                    : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'
                } ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}
                title={isSidebarCollapsed ? "Templates" : ""}
             >
                <div className={`${activeTab === 'templates' ? 'text-pink-500' : 'text-stone-400 group-hover:text-stone-600 transition-colors'}`}>
                    <LayoutTemplate size={20} />
                </div>
                {!isSidebarCollapsed && <span className="whitespace-nowrap overflow-hidden">Templates</span>}
             </button>

             <button
                onClick={() => setActiveTab('creations')}
                className={`w-full flex items-center gap-3 py-3 rounded-2xl transition-all duration-300 group ${
                  activeTab === 'creations' 
                    ? 'bg-white shadow-sm shadow-stone-200 text-stone-900 font-semibold' 
                    : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'
                } ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}
                title={isSidebarCollapsed ? "My Creations" : ""}
             >
                <div className={`${activeTab === 'creations' ? 'text-pink-500' : 'text-stone-400 group-hover:text-stone-600 transition-colors'}`}>
                    <FolderHeart size={20} />
                </div>
                {!isSidebarCollapsed && <span className="whitespace-nowrap overflow-hidden">My Creations</span>}
             </button>

             <button
                onClick={() => setActiveTab('community')}
                className={`w-full flex items-center gap-3 py-3 rounded-2xl transition-all duration-300 group ${
                  activeTab === 'community' 
                    ? 'bg-white shadow-sm shadow-stone-200 text-stone-900 font-semibold' 
                    : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'
                } ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}
                title={isSidebarCollapsed ? "Community" : ""}
             >
                <div className={`${activeTab === 'community' ? 'text-pink-500' : 'text-stone-400 group-hover:text-stone-600 transition-colors'}`}>
                    <Users size={20} />
                </div>
                {!isSidebarCollapsed && <span className="whitespace-nowrap overflow-hidden">Community</span>}
             </button>

             <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 py-3 rounded-2xl transition-all duration-300 group ${
                  activeTab === 'settings' 
                    ? 'bg-white shadow-sm shadow-stone-200 text-stone-900 font-semibold' 
                    : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'
                } ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}
                title={isSidebarCollapsed ? "Settings" : ""}
             >
                <div className={`${activeTab === 'settings' ? 'text-pink-500' : 'text-stone-400 group-hover:text-stone-600 transition-colors'}`}>
                    <Settings size={20} />
                </div>
                {!isSidebarCollapsed && <span className="whitespace-nowrap overflow-hidden">Settings</span>}
             </button>
        </div>

        {/* Collapse Button */}
        <div className={`mt-auto ${isSidebarCollapsed ? 'px-2 flex justify-center' : 'px-4'}`}>
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 text-stone-400 hover:text-stone-900 hover:bg-white/40 rounded-xl transition-all"
                title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            
            {/* Log Out Button */}
             <button
                onClick={() => setView('landing')}
                className={`w-full mt-2 p-2 text-stone-400 hover:text-red-500 hover:bg-white/40 rounded-xl transition-all flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title="Log Out"
            >
                <div className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center text-[10px] font-bold">
                    <div className="w-0.5 h-2 bg-current rotate-45"></div>
                </div>
                {!isSidebarCollapsed && <span className="text-sm font-medium">Log Out</span>}
            </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 bg-white rounded-[2.5rem] shadow-sm overflow-hidden relative border border-stone-100/50 ml-1">
         {renderContent()}
      </main>

    </div>
  );
}