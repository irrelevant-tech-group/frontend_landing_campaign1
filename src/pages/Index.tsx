
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FormSection from "@/components/FormSection";
import TimelineSection from "@/components/TimelineSection";
import SocialProofSection from "@/components/SocialProofSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="bg-void-dark min-h-screen">
      <Header />
      <HeroSection />
      <FormSection />
      <TimelineSection />
      <SocialProofSection />
      <Footer />
    </div>
  );
};

export default Index;
