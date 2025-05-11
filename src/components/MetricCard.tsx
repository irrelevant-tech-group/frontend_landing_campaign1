import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ value, label, gradient = "from-electric-purple to-cosmic-light" }) => {
  const [animatedValue, setAnimatedValue] = useState("0%");
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          animateValue();
        }
      },
      { threshold: 0.5 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  
  const animateValue = () => {
    const numericValue = parseInt(value);
    let current = 0;
    const increment = numericValue / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setAnimatedValue(value);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(current) + "%");
      }
    }, 30);
  };
  
  return (
    <motion.div
      ref={cardRef}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative group"
    >
      {/* Background with glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-future-white/5 to-transparent backdrop-blur-sm border border-electric-purple/20 rounded-2xl"></div>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
           style={{ background: `linear-gradient(135deg, var(--electric-purple)/20, var(--neon-purple)/20)` }}></div>
      
      {/* Card content */}
      <div className="relative p-6 text-center">
        <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {isVisible ? animatedValue : "0%"}
        </div>
        <p className="mt-2 text-future-white/80 text-sm md:text-base">
          {label}
        </p>
        
        {/* Decorative element */}
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-electric-purple opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      
      {/* Bottom gradient line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} opacity-30 group-hover:opacity-100 transition-opacity duration-300`}></div>
    </motion.div>
  );
};

export default MetricCard;