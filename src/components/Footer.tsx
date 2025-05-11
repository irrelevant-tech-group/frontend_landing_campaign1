import { ArrowUp, ArrowRight } from 'lucide-react';
import { trackHeroCTAClick } from '@/lib/mixpanel-events';

const Footer = () => {
  const scrollToTop = () => {
    // Trackear el click del botón de scroll to top
    const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    trackHeroCTAClick('Scroll to Top', 'footer_scroll_top', scrollDepth);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const scrollToForm = () => {
    // Trackear el click del CTA principal del footer
    const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    trackHeroCTAClick('Obtener mi roadmap gratis', 'footer', scrollDepth);
    
    document.getElementById('form-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleLegalLinkClick = (linkType: 'terms' | 'privacy') => {
    // Trackear clicks en links legales
    const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    trackHeroCTAClick(linkType === 'terms' ? 'Términos' : 'Privacidad', 'footer_legal', scrollDepth);
  };
  
  return (
    <footer className="py-16 px-4 bg-void-dark border-t border-electric-purple/10">
      <div className="container mx-auto">
        {/* Main CTA Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-future-white mb-4">
            ¿Listo para implementar IA en tu empresa?
          </h3>
          <p className="text-lg text-future-white/80 mb-8">
            Tu roadmap personalizado te espera. Implementación en 2 semanas, sin complicaciones.
          </p>
          <button 
            onClick={scrollToForm}
            className="bg-electric-purple hover:bg-neon-purple text-future-white px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(112,64,255,0.5)] group inline-flex items-center gap-2"
          >
            Obtener mi roadmap gratis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Minimal Info Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-electric-purple/10">
          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold text-gradient-purple mb-1">irrelevant</h4>
            <p className="text-sm text-future-white/60">IA para empresas que actúan rápido</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-future-white/60 mb-2">
              © 2025 irrelevant. Todos los derechos reservados.
            </p>
            <div className="flex justify-center md:justify-end gap-4">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLegalLinkClick('terms');
                }}
                className="text-sm text-future-white/60 hover:text-electric-purple transition-colors"
              >
                Términos
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLegalLinkClick('privacy');
                }}
                className="text-sm text-future-white/60 hover:text-electric-purple transition-colors"
              >
                Privacidad
              </a>
            </div>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="p-3 rounded-full bg-electric-purple/10 hover:bg-electric-purple/20 transition-all duration-300 group"
          >
            <ArrowUp className="h-5 w-5 text-electric-purple group-hover:text-future-white transition-colors" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;