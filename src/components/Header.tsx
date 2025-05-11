import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { trackHeroCTAClick } from '@/lib/mixpanel-events';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  const handleCTAClick = () => {
    // Trackear el evento antes de hacer scroll
    const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    trackHeroCTAClick('Comenzar ahora', 'header', scrollDepth);
    
    // Hacer scroll al formulario
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-void-dark/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <div>
          <h1 className="text-2xl font-hero font-bold text-gradient-purple">irrelevant</h1>
        </div>
        
        <div>
          <Button
            className="bg-electric-purple/20 hover:bg-electric-purple text-electric-purple hover:text-future-white border border-electric-purple/50 transition-all duration-300"
            onClick={handleCTAClick}
          >
            Comenzar ahora
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;