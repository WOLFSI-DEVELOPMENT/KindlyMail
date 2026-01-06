import React from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { OnboardingFlow, OnboardingData } from './components/OnboardingFlow';
import { BrandAssetsView } from './components/BrandAssetsView';
import { LegalView } from './components/LegalView';
import { NotFoundPage } from './components/NotFoundPage';

// Wrapper to handle onboarding completion and redirect
const OnboardingWrapper = () => {
  const navigate = useNavigate();
  
  const handleComplete = (data: OnboardingData) => {
     // Save onboarded state so Dashboard doesn't redirect back
     localStorage.setItem('kindlymail_onboarded', 'true');
     // Navigate to main app
     navigate('/app');
  };

  return <OnboardingFlow onComplete={handleComplete} />;
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingWrapper />} />
        <Route path="/app" element={<Dashboard />} />
        <Route path="/brand-assets" element={<BrandAssetsView />} />
        <Route path="/legal" element={<LegalView />} />
        {/* Catch-all route for Custom 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}