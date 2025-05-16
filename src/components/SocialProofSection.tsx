import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Download, Clock, CheckCircle } from 'lucide-react';
import { trackScrolledToSection, trackHeroCTAClick } from '@/lib/mixpanel-events';

interface Testimonial {
  id: number;
  text: string;
  author: string;
  company: string;
  timeframe: string;
  result: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "Descargué la guía y en 2 semanas ya tenía 3 procesos automatizados. Lo mejor fue que no necesité personal técnico, todo fue paso a paso.",
    author: "Ana Martínez",
    company: "Distribuidora Norte",
    timeframe: "Implementó en 14 días",
    result: "Redujo 40% tiempo en facturación",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces&auto=format&q=60"
  },
  {
    id: 2,
    text: "Tenía miedo que fuera muy técnico, pero el roadmap me dio exactamente qué herramientas usar y cómo integrarlas. Ya automaticé WhatsApp y Excel.",
    author: "Carlos López",
    company: "Servicios MLópez",
    timeframe: "3 semanas de inicio a fin",
    result: "Ahorra 20h semanales",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=faces&auto=format&q=60"
  },
  {
    id: 3,
    text: "La guía me mostró qué automatizar primero y cuánto iba a costar. Implementé 2 procesos y ya recuperé la inversión en el primer mes.",
    author: "Laura Torres",
    company: "TechySoluciones",
    timeframe: "ROI en 30 días",
    result: "300% de retorno en Q1",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces&auto=format&q=60"
  },
  {
    id: 4,
    text: "Pensaba que la IA era complicada, pero la guía me dio un plan claro. Ahora mis cotizaciones son automáticas y respondo clientes 5x más rápido.",
    author: "Miguel Ramírez",
    company: "Constructora Ramírez",
    timeframe: "Implementó en 10 días",
    result: "5x más rápido en respuestas",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces&auto=format&q=60"
  }
];

// Live Activity Component
const LiveActivity = () => {
  const [visible, setVisible] = useState(true);
  const [currentActivity, setCurrentActivity] = useState({
    name: "José R.",
    action: "descargó su roadmap",
    time: "hace 2 minutos",
    location: "Medellín, Colombia"
  });
  
  const activities = [
    { name: "José R.", action: "descargó su roadmap", time: "hace 2 minutos", location: "Medellín, Colombia" },
    { name: "Maria C.", action: "implementó 1er proceso", time: "hace 5 minutos", location: "Bogotá, Colombia" },
    { name: "Pedro A.", action: "descargó su roadmap", time: "hace 7 minutos", location: "Cali, Colombia" },
    { name: "Ana L.", action: "ahorró 40% tiempo", time: "hace 12 minutos", location: "Barranquilla, Colombia" },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * activities.length);
      setCurrentActivity(activities[randomIndex]);
      setVisible(true);
      
      setTimeout(() => setVisible(false), 4000);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -100 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-6 left-6 z-50 max-w-sm"
    >
      <div className="bg-void-dark/90 backdrop-blur-md border border-electric-purple/20 p-4 rounded-xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-electric-purple flex items-center justify-center text-white font-bold">
            {currentActivity.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm">
              <span className="font-medium text-future-white">{currentActivity.name}</span>{" "}
              <span className="text-electric-purple">{currentActivity.action}</span>
            </p>
            <p className="text-xs text-future-white/60">
              {currentActivity.time} • {currentActivity.location}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SocialProofSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pageLoadTime = useRef(Date.now());
  const hasTrackedSection = useRef(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trackear cuando el usuario llega a la sección de social proof
        if (entry.isIntersecting && !hasTrackedSection.current) {
          hasTrackedSection.current = true;
          const timeOnPage = (Date.now() - pageLoadTime.current) / 1000;
          trackScrolledToSection('social_proof', 5, timeOnPage);
        }
      },
      { threshold: 0.3 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const handleTestimonialNavigationClick = (index: number) => {
    setActiveIndex(index);
    
    // Trackear la interacción con la navegación de testimoniales
    const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    trackHeroCTAClick(`Testimonial Navigation: ${testimonials[index].author}`, 'testimonial_navigation', scrollDepth);
  };

  const handleBottomCTAClick = () => {
    // Trackear el click del CTA en la sección de social proof
    const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    trackHeroCTAClick('Obtener mi roadmap ahora', 'social_proof_cta', scrollDepth);
    
    // Hacer scroll al formulario
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <section ref={sectionRef} className="py-20 px-4 relative">
      <LiveActivity />
      
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-future-white via-cosmic-light to-future-white bg-clip-text text-transparent mb-4">
            Lo que dicen quienes ya tienen su roadmap
          </h2>
          <p className="text-lg text-future-white/80 max-w-2xl mx-auto">
            Empresas reales que implementaron IA en semanas, no meses
          </p>
        </div>
        
        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative min-h-[400px] sm:min-h-[320px] overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: index === activeIndex ? 1 : 0,
                  y: index === activeIndex ? 0 : 50,
                  zIndex: index === activeIndex ? 10 : 0
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute w-full"
              >
                <div className="bg-void-dark/60 backdrop-blur-sm border border-electric-purple/20 rounded-2xl p-6 sm:p-8 relative">
                  {/* Quote Icon */}
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-electric-purple/20" />
                  
                  {/* Content */}
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar & Info */}
                    <div className="md:w-1/3">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16 border-2 border-electric-purple">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                          <AvatarFallback className="bg-electric-purple text-future-white">
                            {testimonial.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-future-white">{testimonial.author}</h3>
                          <p className="text-sm text-future-white/70">{testimonial.company}</p>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-electric-purple" />
                          <span className="text-future-white/80">{testimonial.timeframe}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-success-neon" />
                          <span className="text-future-white/80">{testimonial.result}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Testimonial Text */}
                    <div className="md:w-2/3">
                      <p className="text-lg text-future-white/90 italic leading-relaxed">
                        "{testimonial.text}"
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleTestimonialNavigationClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-electric-purple w-8' 
                    : 'bg-electric-purple/30 hover:bg-electric-purple/50'
                }`}
                aria-label={`Testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-20"
        >
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-electric-purple/10 to-transparent border border-electric-purple/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-electric-purple mb-4">
              ¿Listo para tu roadmap?
            </h3>
            <p className="text-future-white/90 mb-6">
              Únete a las empresas que ya están automatizando y viendo resultados reales en semanas.
            </p>
            <button 
              onClick={handleBottomCTAClick}
              className="bg-electric-purple hover:bg-neon-purple text-future-white px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(112,64,255,0.5)] group inline-flex items-center gap-2"
            >
              Obtener mi roadmap ahora
              <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection;