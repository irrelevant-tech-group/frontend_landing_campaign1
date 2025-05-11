
import { useRef, useEffect, useState } from 'react';

interface TimelineItem {
  title: string;
  description: string;
  isUrgent?: boolean;
}

const timelineItems: TimelineItem[] = [
  {
    title: "Diagnóstico de IA",
    description: "Evaluación completa de tus procesos actuales y oportunidades de mejora con IA."
  },
  {
    title: "Estrategia personalizada",
    description: "Plan de implementación adaptado a tus necesidades específicas y objetivos empresariales."
  },
  {
    title: "Desarrollo e integración",
    description: "Implementación técnica de soluciones de IA integradas con tus sistemas existentes."
  },
  {
    title: "Capacitación a equipos",
    description: "Transferencia de conocimiento para que tu equipo pueda aprovechar al máximo las soluciones."
  },
  {
    title: "Optimización continua",
    description: "Mejora constante basada en datos reales de uso para maximizar el ROI.",
    isUrgent: true
  }
];

const TimelineSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndices, setActiveIndices] = useState<boolean[]>(Array(timelineItems.length).fill(false));
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    
    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        const index = itemRefs.current.findIndex(ref => ref === entry.target);
        if (index !== -1) {
          setActiveIndices(prev => {
            const newState = [...prev];
            newState[index] = entry.isIntersecting;
            return newState;
          });
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    itemRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      itemRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  return (
    <section ref={sectionRef} className="py-24 px-4">
      <div className="container mx-auto">
        <h2 className="text-gradient mb-16 text-center">Tu camino hacia la innovación con IA</h2>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="timeline-line"></div>
          
          {timelineItems.map((item, index) => (
            <div
              key={index}
              ref={el => itemRefs.current[index] = el}
              className={`relative mb-16 transition-all duration-700 ${index % 2 === 0 ? 'md:pr-8 md:text-right md:ml-0 md:mr-auto md:pl-0' : 'md:pl-8 md:ml-auto md:mr-0 md:text-left md:pr-0'} ${
                activeIndices[index] 
                  ? 'opacity-100' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                maxWidth: '45%',
                marginLeft: index % 2 !== 0 ? 'auto' : '',
                marginRight: index % 2 === 0 ? 'auto' : '' 
              }}
            >
              {/* Timeline dot */}
              <div className={`absolute top-0 md:top-2 h-6 w-6 rounded-full bg-electric-purple ${index % 2 === 0 ? 'right-0 md:right-0 md:translate-x-3' : 'left-0 md:left-0 md:-translate-x-3'} ${item.isUrgent ? 'animate-pulse-glow' : ''}`}></div>
              
              {/* Content */}
              <div className={`glass-card p-6 ${item.isUrgent ? 'border-urgency-red/50' : ''}`}>
                <h3 className={`text-xl font-bold mb-2 ${item.isUrgent ? 'text-urgency-red' : 'text-electric-purple'}`}>
                  {item.title}
                </h3>
                <p className="text-future-white/80">{item.description}</p>
                
                {item.isUrgent && (
                  <div className="mt-4 p-2 bg-urgency-red/10 border border-urgency-red/30 rounded text-sm text-urgency-red">
                    Los mejores resultados se logran iniciando ahora. Las empresas que esperan pierden ventaja competitiva.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
