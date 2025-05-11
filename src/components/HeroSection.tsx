import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings, Target, Zap, Workflow } from 'lucide-react';
import { trackHeroCTAClick, trackScrolledToSection } from '@/lib/mixpanel-events';

const HeroSection = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const pageLoadTime = useRef(Date.now());
  const hasTrackedSection = useRef(false);
  
  const phrases = [
    { text: "Pocos la implementan.", icon: <Target className="inline-block w-6 h-6 text-electric-purple ml-3" /> },
    { text: "Tu competencia ya lo hace.", icon: <Zap className="inline-block w-6 h-6 text-success-neon ml-3" /> },
    { text: "¿Tú cuándo?", icon: <div className="inline-block w-6 h-6 ml-3 text-2xl">⏰</div> }
  ];
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        
        // Trackear cuando el usuario llega a la sección hero
        if (entry.isIntersecting && !hasTrackedSection.current) {
          hasTrackedSection.current = true;
          const timeOnPage = (Date.now() - pageLoadTime.current) / 1000;
          trackScrolledToSection('hero', 1, timeOnPage);
        }
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) observer.observe(heroRef.current);
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3500);
    
    return () => clearInterval(interval);
  }, []);
  
  const scrollToForm = () => {
    // Trackear el click del CTA principal
    const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    trackHeroCTAClick('Obtener mi roadmap gratis', 'hero', scrollDepth);
    
    // Hacer scroll al formulario
    document.getElementById('form-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  
  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-void-dark"></div>
        <div className="absolute inset-0 bg-gradient-radial from-electric-purple/10 via-transparent to-transparent"></div>
        <ParticleBackground />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          {/* Main Headline - IA Always Visible */}
          <div className="text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-bold text-future-white leading-[1.1]"
            >
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-future-white via-cosmic-light to-future-white bg-clip-text text-transparent">
                  Todos hablan de IA.
                </span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-electric-purple to-transparent"
                />
              </span>
              <br />
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPhrase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-baseline"
                >
                  {phrases[currentPhrase].text}
                  {phrases[currentPhrase].icon}
                </motion.span>
              </AnimatePresence>
            </motion.h1>
            
            {/* Subheadline - The Bridge */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-6 text-xl md:text-2xl text-future-white/90"
            >
              Te mostramos exactamente <span className="text-electric-purple font-semibold">qué herramientas usar y cómo</span>.
            </motion.p>
          </div>
          
          {/* The Offer - Clear and Valuable */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-electric-purple/10 to-transparent border border-electric-purple/30 rounded-3xl p-8 md:p-12 mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-future-white mb-8 relative">
              <span className="relative">
                El Roadmap de IA Para Tu Empresa
                <span className="absolute inset-0 blur-md opacity-30 text-electric-purple">
                  El Roadmap de IA Para Tu Empresa
                </span>
              </span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-electric-purple/20 flex items-center justify-center">
                  <Settings className="w-8 h-8 text-electric-purple" />
                </div>
                <h3 className="font-semibold text-future-white mb-2">Herramientas Exactas</h3>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-electric-purple/20 flex items-center justify-center">
                  <Workflow className="w-8 h-8 text-electric-purple" />
                </div>
                <h3 className="font-semibold text-future-white mb-2">Procesos a Automatizar</h3>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-electric-purple/20 flex items-center justify-center">
                  <Target className="w-8 h-8 text-electric-purple" />
                </div>
                <h3 className="font-semibold text-future-white mb-2">Plan de Acción</h3>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={scrollToForm}
                className="bg-electric-purple hover:bg-neon-purple text-future-white px-10 py-4 text-lg rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(112,64,255,0.3)] hover:shadow-[0_0_50px_rgba(112,64,255,0.5)] group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Obtener mi roadmap gratis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-future-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              </Button>
              <p className="mt-3 text-sm text-future-white/70">
                2 minutos para completar • Respuesta personalizada inmediata
              </p>
            </div>
          </motion.div>
          
          {/* Social Proof & Last Chance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-electric-purple/10 border border-electric-purple/20 rounded-full text-sm text-future-white/80">
              <div className="w-2 h-2 rounded-full bg-success-neon animate-pulse"></div>
              <span>63 empresas ya automatizando con su roadmap</span>
            </div>
            <p className="text-sm text-future-white/60">
              La IA ya no es una opción, es una necesidad. Empieza ahora.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;