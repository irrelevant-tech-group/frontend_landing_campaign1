
import { useEffect, useState, useRef } from 'react';

interface MetricCardProps {
  value: string;
  label: string;
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedValue, setDisplayedValue] = useState('0%');
  const cardRef = useRef<HTMLDivElement>(null);
  const numericValue = parseInt(value);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    let animationFrameId: number;
    
    // Animate count up
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const duration = 1500; // 1.5 seconds
      
      const easeOut = (t: number): number => {
        return 1 - Math.pow(1 - t, 2);
      };
      
      const percentage = Math.min(progress / duration, 1);
      const easedPercentage = easeOut(percentage);
      const currentValue = Math.floor(easedPercentage * numericValue);
      
      setDisplayedValue(`${currentValue}%`);
      
      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setDisplayedValue(value);
      }
    };
    
    animationFrameId = requestAnimationFrame(animateCount);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible, value, numericValue]);
  
  return (
    <div 
      ref={cardRef}
      className={`glass-card p-5 transition-all duration-500 delay-${delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <p className="text-3xl font-accent text-gradient-purple font-bold">{displayedValue}</p>
      <p className="text-sm mt-2 text-cosmic-light/80">{label}</p>
    </div>
  );
};

export default MetricCard;
