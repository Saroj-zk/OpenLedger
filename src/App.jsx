import React, { useEffect } from 'react';
import HeroSection from './components/HeroSection';
import RoutingStrip from './components/RoutingStrip';
import LayerSection from './components/LayerSection';
import FormatsSection from './components/FormatsSection';
import ModelsSection from './components/ModelsSection';
import CouncilMode from './components/CouncilMode';
import PrivacySection from './components/PrivacySection';
import PricingSection from './components/PricingSection';
import ApiSection from './components/ApiSection';
import EnterpriseSection from './components/EnterpriseSection';
import Footer from './components/Footer';
import ModelsPage from './pages/ModelsPage';
import TokenPage from './pages/TokenPage';
import { useRoute } from './router';

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <RoutingStrip />
      <LayerSection />
      <FormatsSection />
      <ModelsSection />
      <CouncilMode />
      <PrivacySection />
      <PricingSection />
      <ApiSection />
      <EnterpriseSection />
      <Footer />
    </div>
  );
}

function App() {
  const path = useRoute();

  // A new page starts at the top, the way a new page does.
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [path]);

  if (path === '/models') return <ModelsPage />;
  if (path === '/token') return <TokenPage />;
  return <Landing />;
}

export default App;
