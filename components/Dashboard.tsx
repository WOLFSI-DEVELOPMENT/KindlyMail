import React, { useState, useEffect } from 'react';
import { HomeView } from './HomeView';
import { WorkspaceView } from './GeneratedResult';
import { TemplatesView } from './TemplatesView';
import { SettingsView } from './SettingsView';
import { CreationsView } from './CreationsView';
import { CommunityView } from './CommunityView';
import { UserProfileModal } from './UserProfileModal';
import { EmailState, ToneOption, Message, PersonalContext, GeneratedEmail, Creation, OutputFormat, ToneSettings } from '../types';
import { generateEmailDraft } from '../services/geminiService';
import { supabase, publishCreation, CommunityCreation, signOut } from '../services/supabase';
import { Home, FolderHeart, Settings, LayoutTemplate, PanelLeftClose, PanelLeftOpen, Users, LogOut, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'home' | 'templates' | 'creations' | 'settings' | 'community'>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Check auth and onboarding status
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
        try {
            // Check for Google Session (LocalStorage)
            const googleUserStr = localStorage.getItem('kindlymail_google_user');
            if (googleUserStr) {
                if (mounted) {
                    const googleUser = JSON.parse(googleUserStr);
                    setSession({
                        user: {
                            id: googleUser.id || googleUser.sub,
                            email: googleUser.email,
                            user_metadata: {
                                full_name: googleUser.name,
                                avatar_url: googleUser.picture
                            }
                        }
                    });
                    const hasOnboarded = localStorage.getItem('kindlymail_onboarded');
                    if (hasOnboarded !== 'true') {
                        navigate('/onboarding');
                    }
                    setIsAuthLoading(false);
                }
                return;
            }

            // Check for Guest Mode
            const isGuest = localStorage.getItem('kindlymail_guest') === 'true';
            if (isGuest) {
                if (mounted) {
                    setSession({
                        user: {
                            id: 'guest',
                            email: 'guest@kindlymail.demo',
                            user_metadata: {
                                full_name: 'Guest Designer',
                                avatar_url: null
                            }
                        }
                    });
                    const hasOnboarded = localStorage.getItem('kindlymail_onboarded');
                    if (hasOnboarded !== 'true') {
                        navigate('/onboarding');
                    }
                    setIsAuthLoading(false);
                }
                return;
            }

            // Check Supabase
            const { data: { session: sbSession } } = await supabase.auth.getSession();
            
            if (mounted) {
                if (!sbSession) {
                    navigate('/login');
                } else {
                    setSession(sbSession);
                    const hasOnboarded = localStorage.getItem('kindlymail_onboarded');
                    if (hasOnboarded !== 'true') {
                        navigate('/onboarding');
                    }
                }
                setIsAuthLoading(false);
            }
        } catch (error) {
            console.error("Auth check failed", error);
            if (mounted) {
                navigate('/login');
                setIsAuthLoading(false);
            }
        }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
       if (event === 'SIGNED_OUT') {
           // Also clear guest mode/google mode on sign out from Supabase (just in case)
           localStorage.removeItem('kindlymail_guest');
           if (!localStorage.getItem('kindlymail_google_user')) {
               if (mounted) navigate('/login');
           }
       }
       if (session && mounted) {
           setSession(session);
       }
    });

    return () => {
        mounted = false;
        subscription.unsubscribe();
    };
  }, [navigate]);

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

  const handleSignOut = async () => {
    localStorage.removeItem('kindlymail_guest');
    localStorage.removeItem('kindlymail_google_user');
    await signOut();
    navigate('/login');
  };

  const handleInitialGenerate = async (
    prompt: string, 
    imageUrl?: string | null, 
    websiteUrl?: string, 
    brandLogo?: string | null, 
    brandColor?: string, 
    figmaUrl?: string, 
    youtubeUrl?: string,
    outputFormat?: OutputFormat,
    toneSettingsOverride?: ToneSettings
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
      // Pass personalContext and format to the service
      const result = await generateEmailDraft(newMessages, undefined, personalContext, outputFormat, toneSettingsOverride);
      
      let replyContent = outputFormat === 'text' ? "I've drafted a text email for you." : "I've drafted an HTML email for you.";
      
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
    setActiveTab('home');
  };

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

  const handlePublishCreation = async (draft: GeneratedEmail) => {
     if (!session?.user) {
         alert("You must be logged in to publish.");
         return;
     }
     if (session.user.id === 'guest') {
         alert("Guest users cannot publish to the community. Please sign up for an account.");
         return;
     }
     
     const { error } = await publishCreation(draft, session.user.id, session.user.email?.split('@')[0] || 'Anonymous');
     if (error) {
         alert("Failed to publish: " + error.message);
     } else {
         alert("Published to community successfully!");
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

  const handleRemix = (creation: CommunityCreation) => {
    const aiResponse: Message = {
        role: 'model',
        content: `I've loaded the community template "${creation.subject}" by ${creation.author_name}. Ready to remix!`,
        timestamp: Date.now()
    };

    setState({
        recipient: '',
        topic: `Remixing ${creation.subject}`,
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
        <CommunityView onRemix={handleRemix} />
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

    if (!state.generated) {
      return (
        <HomeView 
          onGenerate={handleInitialGenerate} 
          isLoading={state.isGenerating} 
          onOpenSettings={() => setActiveTab('settings')}
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
        onPublish={handlePublishCreation}
      />
    );
  };

  if (isAuthLoading) {
      return (
          <div className="min-h-screen w-full flex items-center justify-center bg-[#f3f4f6]">
              <Loader2 className="animate-spin text-stone-400" size={32} />
          </div>
      );
  }

  const user = session?.user;
  const userName = user?.user_metadata?.full_name || 'User';
  const userAvatar = user?.user_metadata?.avatar_url;
  const userEmail = user?.email || '';

  if (!session) return null;

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
             <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-3 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'home' ? 'bg-white shadow-sm shadow-stone-200 text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'} ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`} title={isSidebarCollapsed ? "Home" : ""}><div className={`${activeTab === 'home' ? 'text-pink-500' : 'text-stone-400 group-hover:text-stone-600 transition-colors'}`}><Home size={20} /></div>{!isSidebarCollapsed && <span className="whitespace-nowrap overflow-hidden">Home</span>}</button>
             <button onClick={() => setActiveTab('templates')} className={`w-full flex items-center gap-3 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'templates' ? 'bg-white shadow-sm shadow-stone-200 text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'} ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`} title={isSidebarCollapsed ? "Templates" : ""}><div className={`${activeTab === 'templates' ? 'text-pink-500' : 'text-stone-400 group-hover:text-stone-600 transition-colors'}`}><LayoutTemplate size={20} /></div>{!isSidebarCollapsed && <span className="whitespace-nowrap overflow-hidden">Templates</span>}</button>
             <button onClick={() => setActiveTab('creations')} className={`w-full flex items-center gap-3 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'creations' ? 'bg-white shadow-sm shadow-stone-200 text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'} ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`} title={isSidebarCollapsed ? "My Creations" : ""}><div className={`${activeTab === 'creations' ? 'text-pink-500' : 'text-stone-400 group-hover:text-stone-600 transition-colors'}`}><FolderHeart size={20} /></div>{!isSidebarCollapsed && <span className="whitespace-nowrap overflow-hidden">My Creations</span>}</button>
             <button onClick={() => setActiveTab('community')} className={`w-full flex items-center gap-3 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'community' ? 'bg-white shadow-sm shadow-stone-200 text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'} ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`} title={isSidebarCollapsed ? "Community" : ""}><div className={`${activeTab === 'community' ? 'text-pink-500' : 'text-stone-400 group-hover:text-stone-600 transition-colors'}`}><Users size={20} /></div>{!isSidebarCollapsed && <span className="whitespace-nowrap overflow-hidden">Community</span>}</button>
             <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'settings' ? 'bg-white shadow-sm shadow-stone-200 text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'} ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`} title={isSidebarCollapsed ? "Settings" : ""}><div className={`${activeTab === 'settings' ? 'text-pink-500' : 'text-stone-400 group-hover:text-stone-600 transition-colors'}`}><Settings size={20} /></div>{!isSidebarCollapsed && <span className="whitespace-nowrap overflow-hidden">Settings</span>}</button>
        </div>

        {/* Footer Area */}
        <div className={`mt-auto ${isSidebarCollapsed ? 'px-2 flex flex-col items-center gap-4' : 'px-4'}`}>
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-white/40 rounded-xl transition-all mb-2" title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>{isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}</button>
            {user && (<button onClick={() => setIsProfileModalOpen(true)} className={`flex items-center gap-3 p-1.5 rounded-full bg-white border border-stone-100 shadow-sm hover:shadow-md transition-all w-full ${isSidebarCollapsed ? 'justify-center aspect-square p-0 w-10 h-10' : ''}`}><div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200 flex-shrink-0">{userAvatar ? (<img src={userAvatar} alt="User" className="w-full h-full object-cover" />) : (<User size={16} className="text-stone-400" />)}</div>{!isSidebarCollapsed && (<div className="flex-1 text-left min-w-0 pr-2"><p className="text-xs font-bold text-stone-900 truncate">{userName}</p><p className="text-[10px] text-stone-400 truncate">{userEmail}</p></div>)}</button>)}
            {!user && (<button onClick={() => navigate('/')} className={`w-full p-2 text-stone-400 hover:text-red-500 hover:bg-white/40 rounded-xl transition-all flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`} title="Log Out"><LogOut size={16} />{!isSidebarCollapsed && <span className="text-sm font-medium">Log Out</span>}</button>)}
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 bg-white rounded-[2.5rem] shadow-sm overflow-hidden relative border border-stone-100/50 ml-1">
         {renderContent()}
      </main>
      
      {/* Profile Modal */}
      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} user={user} onSignOut={handleSignOut} />
    </div>
  );
};