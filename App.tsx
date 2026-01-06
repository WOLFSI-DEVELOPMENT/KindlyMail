import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { OnboardingFlow } from './components/OnboardingFlow';
import { BrandAssetsView } from './components/BrandAssetsView';
import { LegalView } from './components/LegalView';
import { NotFoundPage } from './components/NotFoundPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/app" element={<Dashboard />} />
        <Route path="/brand-assets" element={<BrandAssetsView />} />
        <Route path="/legal" element={<LegalView />} />
        {/* Catch-all route for Custom 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}