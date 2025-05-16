import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Lightbulb, TrendingUp, Calendar, Clock, DollarSign, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackScrolledToSection } from '@/lib/mixpanel-events';

const IdealForSection = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasTrackedSection = useRef<boolean>(false);
  const pageLoadTime = useRef(Date.now());
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        
        // Trackear cuando el usuario llega a esta sección
        if (entry.isIntersecting && !hasTrackedSection.current) {
          hasTrackedSection.current = true;
          const timeOnPage = (Date.now() - pageLoadTime.current) / 1000;
          trackScrolledToSection('ideal_for', 2, timeOnPage);
        }
      },
      { threshold: 0.3 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);
  
  const scrollToForm = () => {
    document.getElementById('form-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  
  // Datos para la sección
  const idealForItems = [
    {
      icon: Lightbulb,
      title: "Emprendedores visionarios",
      description: "Que ven la automatización como clave para escalar pero no saben por dónde empezar"
    },
    {
      icon: TrendingUp,
      title: "Empresas en crecimiento",
      description: "Donde los procesos manuales están frenando su capacidad para crecer más rápido"
    },
    {
      icon: Calendar,
      title: "Directivos sin tiempo",
      description: "Que necesitan optimizar operaciones pero no pueden perder meses implementando"
    },
    {
      icon: DollarSign,
      title: "Negocios buscando eficiencia",
      description: "Que quieren reducir costos operativos sin sacrificar calidad de servicio"
    }
  ];
  
  const notForItems = [
    "Empresas que buscan reemplazar por completo a su personal",
    "Quienes esperan que la IA resuelva todos sus problemas sin cambios internos",
    "Negocios que no están dispuestos a invertir tiempo en la implementación",
    "Compañías satisfechas con sus procesos actuales y sin interés en mejorar"
  ];
  
  return (
    <section id="ideal-for-section" ref={sectionRef} className="py-16 sm:py-24 px-4 bg-gradient-to-b from-void-dark via-[#080622] to-void-dark">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isIntersecting ? 1 : 0, y: isIntersecting ? 0 : 30 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-future-white to-cyan-300 bg-clip-text text-transparent">
                ¿Esto es para ti?
              </span>
            </h2>
            <p className="text-base sm:text-lg text-future-white/80">
              La automatización con IA no es para todos. Antes de seguir, veamos si podemos ayudarte.
            </p>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Ideal For */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-cyan-400/5 to-electric-purple/5 rounded-2xl border border-cyan-400/20 shadow-[0_0_40px_rgba(103,232,249,0.05)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-future-white">
                  Ideal para...
                </h3>
              </div>
              
              <ul className="space-y-5">
                {idealForItems.map((item, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-9 h-9 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-cyan-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-future-white mb-1">{item.title}</h4>
                      <p className="text-future-white/70">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10">
                <Button
                  onClick={scrollToForm}
                  className="w-full bg-gradient-to-r from-electric-purple to-cyan-400 hover:from-electric-purple/90 hover:to-cyan-400/90 text-future-white py-4 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(103,232,249,0.2)]"
                >
                  <span className="text-lg">¡Sí, esto es para mí!</span>
                </Button>
              </div>
            </div>
            
            {/* Not For */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-red-500/5 to-amber-400/5 rounded-2xl border border-red-400/20 shadow-[0_0_40px_rgba(248,113,113,0.05)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-400/10 flex items-center justify-center">
                  <X className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-future-white">
                  No es para...
                </h3>
              </div>
              
              <ul className="space-y-5">
                {notForItems.map((item, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-8 h-8 rounded-full bg-red-400/10 flex items-center justify-center">
                        <X className="w-4 h-4 text-red-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-future-white/70">{item}</p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 p-4 rounded-xl bg-amber-400/10 border border-amber-400/20">
                <div className="flex gap-3">
                  <div className="mt-1">
                    <Brain className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-future-white/80 text-sm">
                      <span className="font-medium text-amber-400">Recuerda:</span> La IA no sustituye a las personas, las potencia. Buscamos empresas que quieran liberar a su equipo de tareas repetitivas para enfocarse en lo que realmente importa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Benefits Highlight */}
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <p className="text-lg text-future-white/90 mb-6">
              <span className="text-cyan-400 font-semibold">+75% de nuestros clientes</span> ven resultados tangibles en menos de 3 semanas tras implementar sus primeros procesos automatizados
            </p>
            <Button
              onClick={scrollToForm}
              className="bg-electric-purple hover:bg-neon-purple text-future-white px-8 py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(112,64,255,0.5)]"
            >
              Quiero mi roadmap personalizado
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IdealForSection;