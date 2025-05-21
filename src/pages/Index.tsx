import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import IdealForSection from "@/components/IdealForSection";
import FormSection from "@/components/FormSection";
import TimelineSection from "@/components/TimelineSection";
import SocialProofSection from "@/components/SocialProofSection";
import Footer from "@/components/Footer";
import { useScrollTracking } from "@/hooks/useScrollTracking";

const Index = () => {
  // Configurar tracking de scroll para todas las secciones principales
  // Nota: Algunas secciones ya tienen sus propios IDs (como form-section)
  useScrollTracking([
    { id: 'hero-section', name: 'hero' },
    { id: 'ideal-for-section', name: 'ideal_for' },
    { id: 'form-section', name: 'form' },
    { id: 'timeline-section', name: 'timeline' },
    { id: 'social-proof-section', name: 'social_proof' },
    { id: 'footer-section', name: 'footer' }
  ]);

  return (
    <div className="bg-void-dark min-h-screen">
      <Header />
      <FormSection />
      <div id="hero-section">
        <HeroSection />
      </div>
      <IdealForSection />
      <div id="timeline-section">
        <TimelineSection />
      </div>
      <div id="social-proof-section">
        <SocialProofSection />
      </div>
      <div id="footer-section">
        <Footer />
      </div>
    </div>
  );
};

export default Index;