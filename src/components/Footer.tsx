import { ArrowUp, ArrowRight, MessageSquare } from 'lucide-react';
import { trackHeroCTAClick } from '@/lib/mixpanel-events';

// URL de la comunidad de WhatsApp
const WHATSAPP_COMMUNITY_LINK = 'https://chat.whatsapp.com/JMSMme18JN9B6zHdRC6ZGg';

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
  
  const joinWhatsAppCommunity = () => {
    // Trackear el click del CTA de WhatsApp
    const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    trackHeroCTAClick('Unirse a comunidad WhatsApp', 'footer_whatsapp', scrollDepth);
    
    // Abrir enlace de WhatsApp en nueva pestaña
    window.open(WHATSAPP_COMMUNITY_LINK, '_blank', 'noopener,noreferrer');
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToForm}
              className="bg-electric-purple hover:bg-neon-purple text-future-white px-6 py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(112,64,255,0.5)] group inline-flex items-center justify-center gap-2"
            >
              Obtener mi roadmap gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={joinWhatsAppCommunity}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(22,163,74,0.5)] group inline-flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Unirse a OS By irrelevant
            </button>
          </div>
        </div>
        
        {/* WhatsApp Community Highlight */}
        <div className="max-w-3xl mx-auto mb-12 p-4 sm:p-6 rounded-xl bg-gradient-to-r from-green-900/20 to-green-600/20 border border-green-500/30">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="bg-green-600/20 p-3 rounded-full">
              <MessageSquare className="w-8 h-8 text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-future-white mb-1">Comunidad OS By irrelevant</h4>
              <p className="text-future-white/80 mb-2">100% gratuita donde aprendes a implementar herramientas de tecnología y procesos automatizables sin morir en el intento.</p>
              <button 
                onClick={joinWhatsAppCommunity}
                className="text-green-400 hover:text-green-300 font-medium inline-flex items-center gap-1 group"
              >
                Unirse ahora
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
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