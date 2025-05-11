
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <footer className="py-12 px-4 bg-void-dark border-t border-white/5">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl font-hero font-bold text-gradient-purple mb-2">irrelevant</h3>
            <p className="text-cosmic-light/70">Transformando el futuro con IA</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
            <div>
              <h4 className="text-cosmic-light font-semibold mb-4">Soluciones</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-cosmic-light/70 hover:text-electric-purple transition-colors">IA para Marketing</a></li>
                <li><a href="#" className="text-cosmic-light/70 hover:text-electric-purple transition-colors">IA para Ventas</a></li>
                <li><a href="#" className="text-cosmic-light/70 hover:text-electric-purple transition-colors">IA para Operaciones</a></li>
                <li><a href="#" className="text-cosmic-light/70 hover:text-electric-purple transition-colors">IA para Atención</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-cosmic-light font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-cosmic-light/70 hover:text-electric-purple transition-colors">Blog</a></li>
                <li><a href="#" className="text-cosmic-light/70 hover:text-electric-purple transition-colors">Webinars</a></li>
                <li><a href="#" className="text-cosmic-light/70 hover:text-electric-purple transition-colors">Casos de éxito</a></li>
                <li><a href="#" className="text-cosmic-light/70 hover:text-electric-purple transition-colors">Newsletter</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-cosmic-light font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-cosmic-light/70 hover:text-electric-purple transition-colors">Contactar</a></li>
                <li><a href="#" className="text-cosmic-light/70 hover:text-electric-purple transition-colors">Soporte</a></li>
                <li><a href="#" className="text-cosmic-light/70 hover:text-electric-purple transition-colors">Únete al equipo</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-cosmic-light/60">© 2025 irrelevant. Todos los derechos reservados.</p>
          
          <div className="flex mt-4 md:mt-0">
            <a href="#" className="text-cosmic-light/60 hover:text-cosmic-light text-sm mx-2">Términos</a>
            <a href="#" className="text-cosmic-light/60 hover:text-cosmic-light text-sm mx-2">Privacidad</a>
            <a href="#" className="text-cosmic-light/60 hover:text-cosmic-light text-sm mx-2">Cookies</a>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="mt-8 md:mt-0 p-3 rounded-full bg-white/5 hover:bg-electric-purple/20 transition-all duration-300"
          >
            <ArrowUp className="h-5 w-5 text-cosmic-light" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
