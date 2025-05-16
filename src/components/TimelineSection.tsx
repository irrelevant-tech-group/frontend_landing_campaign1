import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Skull, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';
import { trackScrolledToSection, trackHeroCTAClick } from '@/lib/mixpanel-events';

interface TimelineEvent {
  timestamp: string;
  event: string;
  impact: string;
  cost: string;
  isNegative?: boolean;
}

const timelineEvents: TimelineEvent[] = [
  {
    timestamp: "JUNIO 2025",
    event: "ChatGPT llega a 600M de usuarios semanales",
    impact: "Tu competencia empieza a experimentar",
    cost: "Comienzas a quedarte atrás"
  },
  {
    timestamp: "AGOSTO 2025",
    event: "Automatización masiva en LATAM",
    impact: "Empresas automatizan procesos simples",
    cost: "Te tardas 3x más en operaciones básicas",
    isNegative: true
  },
  {
    timestamp: "OCTUBRE 2025",
    event: "Clientes esperan respuestas instantáneas",
    impact: "El mercado cambió sus expectativas",
    cost: "Pierdes clientes por lentitud",
    isNegative: true
  },
  {
    timestamp: "DICIEMBRE 2025",
    event: "El costo de implementar subió",
    impact: "La ventana de oportunidad se cierra",
    cost: "Cada día que esperas es dinero tirado a la basura",
    isNegative: true
  }
];

const TimelineSection = () => {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pageLoadTime = useRef(Date.now());
  const hasTrackedSection = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        
        // Trackear cuando el usuario llega a la sección timeline
        if (entry.isIntersecting && !hasTrackedSection.current) {
          hasTrackedSection.current = true;
          const timeOnPage = (Date.now() - pageLoadTime.current) / 1000;
          trackScrolledToSection('timeline', 4, timeOnPage);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const handleMainCTAClick = () => {
    // Trackear el click del CTA principal
    const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    trackHeroCTAClick('Sí, quiero mi roadmap ahora', 'timeline_cta', scrollDepth);
    
    // Hacer scroll al formulario
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNotNowClick = () => {
    // Trackear el click del botón "No, prefiero esperar y ver"
    const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    trackHeroCTAClick('No, prefiero esperar y ver', 'timeline_negative_cta', scrollDepth);
  };

  const handleEventClick = (index: number) => {
    setActiveEvent(activeEvent === index ? null : index);
    
    // Trackear la interacción con los eventos de la timeline
    const event = timelineEvents[index];
    const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    trackHeroCTAClick(`Timeline Event: ${event.event}`, 'timeline_event', scrollDepth);
  };

  return (
    <section ref={sectionRef} className="relative py-24 px-4 overflow-hidden">
      {/* Background with dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void-dark/80 to-void-dark"></div>
      
      <div className="container mx-auto relative z-10">
        {/* Header with stark reality */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            className="text-4xl md:text-6xl font-bold text-future-white mb-6"
          >
            Mientras tú pensabas...
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-xl text-urgency-red max-w-3xl mx-auto"
          >
            Esto es lo que pasara en los proximos 6 meses. Y por qué cada día cuenta.
          </motion.p>
        </div>

        {/* Interactive Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-electric-purple via-warning-orange to-urgency-red transform -translate-x-1/2 hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-b from-electric-purple via-warning-orange to-urgency-red blur-md opacity-50"></div>
          </div>

          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.3 }}
              className="relative mb-16"
            >
              <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} md:gap-8`}>
                {/* Content Card */}
                <div 
                  className={`flex-1 p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    activeEvent === index 
                      ? 'bg-electric-purple/10 border-electric-purple shadow-[0_0_30px_rgba(112,64,255,0.3)]' 
                      : event.isNegative 
                        ? 'bg-urgency-red/5 border-urgency-red/30 hover:bg-urgency-red/10' 
                        : 'bg-void-dark/90 border-electric-purple/20 hover:border-electric-purple/40'
                  }`}
                  onClick={() => handleEventClick(index)}
                >
                  {/* Timestamp */}
                  <div className={`text-sm font-bold mb-2 ${
                    event.isNegative ? 'text-urgency-red' : 'text-electric-purple'
                  }`}>
                    {event.timestamp}
                  </div>
                  
                  {/* Event */}
                  <h3 className="text-xl font-bold text-future-white mb-2">
                    {event.event}
                  </h3>
                  
                  {/* Quick impact */}
                  <p className="text-future-white/70 mb-3">
                    {event.impact}
                  </p>
                  
                  {/* Cost */}
                  <div className={`p-3 rounded-lg ${
                    event.isNegative ? 'bg-urgency-red/20' : 'bg-electric-purple/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      {event.isNegative ? (
                        <AlertCircle className="w-4 h-4 text-urgency-red" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-electric-purple" />
                      )}
                      <span className={`text-sm font-medium ${
                        event.isNegative ? 'text-urgency-red' : 'text-electric-purple'
                      }`}>
                        {event.cost}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className={`hidden md:block w-6 h-6 rounded-full border-4 ${
                  event.isNegative 
                    ? 'bg-urgency-red border-urgency-red' 
                    : 'bg-electric-purple border-electric-purple'
                } ${activeEvent === index ? 'ring-4 ring-white/20' : ''}`}>
                  {activeEvent === index && (
                    <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-void-dark px-3 py-1 rounded-full border border-electric-purple/30">
                      <span className="text-xs text-electric-purple">CLICK DETALLES</span>
                    </div>
                  )}
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block flex-1"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom message - Reality Check */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5 }}
          className="mt-32 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <div className="p-8 bg-gradient-to-br from-urgency-red/10 to-void-dark border-l-4 border-urgency-red rounded-r-2xl">
              <div className="flex items-start gap-4">
                <Skull className="w-8 h-8 text-urgency-red flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-future-white mb-3">
                    ¿Cuál es tu plan?
                  </h3>
                  <p className="text-lg text-future-white/90 mb-4">
                    Mientras debatías si la IA es relevante, tu competencia ya está automatizando. 
                    Los clientes están comparando tu velocidad de respuesta con la de ellos.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-urgency-red/10 rounded-lg border border-urgency-red/30">
                      <h4 className="font-bold text-urgency-red mb-1">Si no actúas:</h4>
                      <ul className="text-sm text-future-white/80 space-y-1">
                        <li>• Costos operativos crecen con cada venta</li>
                        <li>• Pierdes clientes por lentitud</li>
                        <li>• Tu equipo se quema haciendo tareas repetitivas</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-electric-purple/10 rounded-lg border border-electric-purple/30">
                      <h4 className="font-bold text-electric-purple mb-1">Si actúas ya:</h4>
                      <ul className="text-sm text-future-white/80 space-y-1">
                        <li>• Automatizas en 2 semanas</li>
                        <li>• Reduces costos operativos 40%</li>
                        <li>• Tu equipo se enfoca en lo que importa</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={handleMainCTAClick}
                      className="bg-electric-purple hover:bg-neon-purple text-future-white px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(112,64,255,0.5)] font-medium"
                    >
                      Sí, quiero mi roadmap ahora
                    </button>
                    <button 
                      onClick={handleNotNowClick}
                      className="border border-urgency-red/30 text-urgency-red hover:bg-urgency-red/10 px-8 py-4 rounded-full transition-all duration-300"
                    >
                      No, prefiero esperar y ver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TimelineSection;