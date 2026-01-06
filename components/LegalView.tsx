import React, { useState } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';

interface LegalViewProps {
  onBack: () => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
               <Heart size={16} fill="white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-black">KindlyMail</span>
          </div>
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        
        <div className="flex justify-center mb-12">
            <div className="bg-stone-100 p-1 rounded-xl inline-flex">
                <button 
                    onClick={() => setActiveTab('privacy')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'privacy' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                    Privacy Policy
                </button>
                <button 
                    onClick={() => setActiveTab('terms')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'terms' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                    Terms of Service
                </button>
            </div>
        </div>

        {activeTab === 'privacy' && (
            <div className="prose prose-stone max-w-none">
                <h1 className="font-display font-bold mb-4">Privacy Policy</h1>
                <p className="text-sm text-stone-500 mb-8">Last Updated: January 1, 2026</p>
                
                <p>Welcome to KindlyMail. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
                
                <h3>1. Important Information and Who We Are</h3>
                <p>KindlyMail AI Inc. is the controller and responsible for your personal data. We have appointed a data privacy manager who is responsible for overseeing questions in relation to this privacy policy.</p>
                
                <h3>2. The Data We Collect About You</h3>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                <ul>
                    <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                    <li><strong>Contact Data</strong> includes billing address, email address and telephone numbers.</li>
                    <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                </ul>

                <h3>3. How We Use Your Personal Data</h3>
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <ul>
                    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                </ul>
            </div>
        )}

        {activeTab === 'terms' && (
            <div className="prose prose-stone max-w-none">
                <h1 className="font-display font-bold mb-4">Terms of Service</h1>
                <p className="text-sm text-stone-500 mb-8">Last Updated: January 1, 2026</p>
                
                <p>These Terms of Service ("Terms") govern your access to and use of the services, websites, and applications offered by KindlyMail AI Inc. ("KindlyMail", "we", "us", or "our").</p>
                
                <h3>1. Acceptance of Terms</h3>
                <p>By creating an account, accessing, or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
                
                <h3>2. AI-Generated Content</h3>
                <p>You acknowledge that the content generated by our AI models is probabilistic and may contain errors. You are responsible for reviewing and verifying all generated content before using it in your campaigns. KindlyMail is not liable for any damages resulting from the use of generated content.</p>

                <h3>3. Intellectual Property</h3>
                <p>The Service and its original content (excluding content provided by you or generated for you), features, and functionality are and will remain the exclusive property of KindlyMail AI Inc. and its licensors.</p>

                <h3>4. Termination</h3>
                <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            </div>
        )}

      </main>
    </div>
  );
};