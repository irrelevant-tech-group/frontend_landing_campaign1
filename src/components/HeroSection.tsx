import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings, Target, Zap, Workflow } from 'lucide-react';
import { trackHeroCTAClick, trackScrolledToSection } from '@/lib/mixpanel-events';
import { trackCTAClick, trackSectionView } from '@/lib/facebook-pixel';

const HeroSection = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);
  const pageLoadTime = useRef(Date.now());
  const hasTrackedSection = useRef(false);
  
  const phrases = [
    { text: "Pocos la implementan.", icon: <Target className="inline-block w-5 h-5 sm:w-6 sm:h-6 text-electric-purple ml-2" /> },
    { text: "Tu competencia ya lo hace.", icon: <Zap className="inline-block w-5 h-5 sm:w-6 sm:h-6 text-success-neon ml-2" /> },
    { text: "¿Y tú, cuándo lo harás?", icon: <div className="inline-block w-5 h-5 sm:w-6 sm:h-6 ml-2 text-xl sm:text-2xl">⏰</div> }
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
          
          // Facebook Pixel - trackear vista de sección hero
          trackSectionView('hero');
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
    
    // Facebook Pixel - trackear clic en CTA
    trackCTAClick('hero_obtener_roadmap');
    
    // Hacer scroll al formulario
    document.getElementById('form-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  
  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-void-dark"></div>
        <div className="absolute inset-0 bg-gradient-radial from-electric-purple/10 via-transparent to-transparent"></div>
        <ParticleBackground />
      </div>
      
      {/* Main Content */}
      <div className="w-full relative z-10 px-4 sm:px-6 pt-16 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto"
        >
          {/* Main Headline - IA Always Visible */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-future-white leading-[1.15]"
            >
              <span className="bg-gradient-to-r from-future-white via-cosmic-light to-future-white bg-clip-text text-transparent">
                Todos hablan de IA.
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
            
            {/* Subheadline - Updated with Hormozi approach */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-future-white/90 max-w-xs sm:max-w-md mx-auto"
            >
              Te entregamos un <span className="text-electric-purple font-semibold">plan exacto para automatizar tu empresa en 14 días.</span>
              <span className="text-success-neon font-semibold block mt-1">100% personalizado. Gratis.</span>
            </motion.p>
          </div>
          
          {/* The Offer - Simplified but Impactful */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="w-full bg-gradient-to-br from-electric-purple/10 to-transparent border border-electric-purple/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-6 sm:mb-8"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-future-white mb-5 sm:mb-6">
              El Roadmap de IA Para Tu Empresa
            </h2>
            
            <div className="space-y-5 mb-5 sm:mb-7">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-electric-purple/20 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-electric-purple" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="font-semibold text-future-white text-sm sm:text-base">Herramientas Exactas</h3>
                  <p className="text-xs text-future-white/70">Seleccionadas para tu industria</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-electric-purple/20 flex items-center justify-center flex-shrink-0">
                  <Workflow className="w-5 h-5 sm:w-6 sm:h-6 text-electric-purple" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="font-semibold text-future-white text-sm sm:text-base">Procesos a Automatizar</h3>
                  <p className="text-xs text-future-white/70">Ahorra hasta 15h semanales</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-electric-purple/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-electric-purple" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="font-semibold text-future-white text-sm sm:text-base">Plan de Acción</h3>
                  <p className="text-xs text-future-white/70">Implementación en 14 días</p>
                </div>
              </div>
            </div>
            
            {/* Results - Minimal */}
            <div className="flex justify-between mb-6 border-t border-b border-electric-purple/20 py-3">
              <div className="text-center flex-1">
                <p className="text-xs text-future-white/70">Productividad</p>
                <p className="text-success-neon font-semibold">+30%</p>
              </div>
              <div className="h-full w-px bg-electric-purple/20"></div>
              <div className="text-center flex-1">
                <p className="text-xs text-future-white/70">Ahorro de tiempo</p>
                <p className="text-success-neon font-semibold">+40%</p>
              </div>
            </div>
            
            {/* FOMO - Minimal */}
            <div className="mb-6 opacity-90">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-electric-purple">Cupos limitados: 34/50 esta semana</p>
              </div>
              <div className="w-full bg-void-dark/50 h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-electric-purple to-success-neon rounded-full transition-all duration-500"
                  style={{ width: '68%' }}
                ></div>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={scrollToForm}
                className="w-full bg-electric-purple hover:bg-neon-purple text-future-white px-6 py-2.5 text-sm sm:text-base rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(112,64,255,0.3)] hover:shadow-[0_0_30px_rgba(112,64,255,0.5)] group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Obtener mi roadmap gratis
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <p className="mt-2 text-xs text-future-white/70">
                2 minutos • <span className="text-success-neon">Respuesta inmediata</span>
              </p>
            </div>
          </motion.div>
          
          {/* Social Proof - Super Streamlined */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-electric-purple/10 border border-electric-purple/20 rounded-full text-xs text-future-white/80">
              <div className="w-1.5 h-1.5 rounded-full bg-success-neon animate-pulse"></div>
              <span>63 empresas ya aumentaron su productividad</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;