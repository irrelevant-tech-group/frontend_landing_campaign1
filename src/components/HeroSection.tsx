
import { useEffect, useState } from 'react';
import ParticleBackground from './ParticleBackground';
import MetricCard from './MetricCard';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = [
    "Pocos la usan bien.",
    "Menos la implementan.",
    "Nadie como nosotros.",
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-20 px-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-electric-purple/10 to-transparent opacity-30"></div>
        <ParticleBackground />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="animate-fade-in text-gradient">
            Todos hablan de IA.
            <span className="overflow-hidden block mt-2">
              <span className="block transition-all duration-500 ease-in-out transform"
                    style={{
                      opacity: 1,
                      transform: 'translateY(0)',
                      filter: 'blur(0px)'
                    }}>
                {phrases[currentPhrase]}
              </span>
            </span>
          </h1>
          
          <p className="mt-6 text-future-white/80 text-lg md:text-xl animate-slide-in-bottom opacity-0" style={{ animationDelay: '300ms' }}>
            La mayoría de empresas siente la presión de implementar IA, pero pocas lo hacen efectivamente. 
            Descubre cómo ser parte del grupo exclusivo que realmente transforma su negocio.
          </p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard value="73%" label="planean adoptar IA" delay={100} />
            <MetricCard value="89%" label="sienten presión competitiva" delay={300} />
            <MetricCard value="45%" label="están perdiendo oportunidades" delay={500} />
          </div>
          
          <div className="mt-12 animate-slide-in-bottom opacity-0" style={{ animationDelay: '800ms' }}>
            <Button 
              className="bg-electric-purple hover:bg-neon-purple text-future-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(112,64,255,0.5)] group"
              onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Descubre cómo implementar IA 
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
