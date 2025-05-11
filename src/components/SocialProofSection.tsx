
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  id: number;
  text: string;
  author: string;
  company: string;
  avatar?: string;
}

interface CompanyLogo {
  name: string;
  logo: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "irrelevant transformó nuestra estrategia de IA en tiempo récord. Los resultados fueron inmediatos y el ROI superó todas nuestras expectativas.",
    author: "Ana García",
    company: "TechVision Inc.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces&auto=format&q=60"
  },
  {
    id: 2,
    text: "Pasamos de tener miedo a la IA a aprovecharla como ventaja competitiva. El equipo de irrelevant hizo que todo el proceso fuera claro y efectivo.",
    author: "Carlos Mendoza",
    company: "DataFlow Systems",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=faces&auto=format&q=60"
  },
  {
    id: 3,
    text: "La implementación de IA con irrelevant nos permitió reducir costos operativos en un 35% y mejorar la satisfacción del cliente en solo 3 meses.",
    author: "Elena Fuentes",
    company: "Global Services",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces&auto=format&q=60"
  }
];

const companies: CompanyLogo[] = [
  { name: "TechVision Inc.", logo: "TV" },
  { name: "DataFlow Systems", logo: "DF" },
  { name: "Global Services", logo: "GS" },
  { name: "Future Solutions", logo: "FS" },
  { name: "Innovate AI", logo: "IA" },
  { name: "Smart Enterprise", logo: "SE" },
];

// Notification component
const LiveNotification = () => {
  const [visible, setVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState({
    name: "Miguel L.",
    action: "acaba de registrarse",
    time: "hace 1 minuto",
    location: "Madrid, España"
  });
  
  const notifications = [
    { name: "Miguel L.", action: "acaba de registrarse", time: "hace 1 minuto", location: "Madrid, España" },
    { name: "Sara T.", action: "solicitó su estrategia", time: "hace 3 minutos", location: "Barcelona, España" },
    { name: "Juan R.", action: "comenzó implementación", time: "hace 7 minutos", location: "Sevilla, España" },
    { name: "Laura M.", action: "acaba de registrarse", time: "hace 10 minutos", location: "Valencia, España" },
  ];
  
  useEffect(() => {
    // Show notification after 3 seconds
    const timeout = setTimeout(() => {
      setVisible(true);
    }, 3000);
    
    // Rotate notifications
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * notifications.length);
      setCurrentNotification(notifications[randomIndex]);
      setVisible(true);
      
      // Hide after 5 seconds
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    }, 8000);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);
  
  return (
    <div className={`fixed bottom-5 left-5 z-50 max-w-xs bg-glass backdrop-blur-lg p-4 rounded-lg shadow-lg transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
      <div className="flex items-center">
        <div className="bg-electric-purple rounded-full h-8 w-8 flex items-center justify-center mr-3">
          {currentNotification.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm"><span className="font-semibold">{currentNotification.name}</span> {currentNotification.action}</p>
          <p className="text-xs text-cosmic-light/70">{currentNotification.time} • {currentNotification.location}</p>
        </div>
      </div>
    </div>
  );
};

const SocialProofSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <LiveNotification />
        
        <h2 className="text-gradient mb-16 text-center">Empresas que ya transformaron su futuro</h2>
        
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative h-64 overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute w-full transition-all duration-500 glass-card p-8 ${
                  index === activeIndex 
                    ? 'opacity-100 translate-y-0 z-10' 
                    : 'opacity-0 translate-y-8 -z-10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-electric-purple">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback className="bg-electric-purple text-future-white">{testimonial.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg italic mb-4">"{testimonial.text}"</p>
                    <div>
                      <p className="font-semibold text-cosmic-light">{testimonial.author}</p>
                      <p className="text-sm text-cosmic-light/70">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${index === activeIndex ? 'bg-electric-purple w-8' : 'bg-cosmic-light/30'}`}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-16">
          <p className="text-center text-cosmic-light/70 mb-8">Empresas que confían en irrelevant</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {companies.map((company) => (
              <div 
                key={company.name}
                className="flex items-center justify-center h-24 glass-card hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-2xl font-accent text-cosmic-light/90 font-semibold">{company.logo}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-20 text-center">
          <div className="glass-card max-w-2xl mx-auto p-8">
            <h3 className="text-gradient-purple mb-4 text-2xl">¿Listo para ser parte del futuro?</h3>
            <p className="text-future-white/80 mb-6">
              Las empresas que están implementando IA correctamente hoy estarán liderando mañana.
              No te quedes atrás.
            </p>
            <button 
              className="bg-electric-purple hover:bg-neon-purple text-future-white px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(112,64,255,0.5)]"
              onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Comenzar mi transformación digital
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
