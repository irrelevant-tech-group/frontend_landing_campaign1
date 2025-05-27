// ID del Pixel de Facebook
const PIXEL_ID = '2425468451165587';

// Variable para controlar si el pixel está inicializado
let isPixelInitialized = false;

// Función para inicializar el Pixel de forma segura
export const initFacebookPixel = (): void => {
  // Verificar si estamos en el navegador
  if (typeof window === 'undefined' || isPixelInitialized) {
    return;
  }

  try {
    // Inicialización manual del pixel (sin dependencias externas)
    (function(f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode?.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    // Inicializar el pixel
    if (window.fbq) {
      window.fbq('init', PIXEL_ID);
      isPixelInitialized = true;
      
      if (import.meta.env.DEV) {
        console.log('Facebook Pixel inicializado correctamente');
      }
    }
  } catch (error) {
    console.error('Error al inicializar Facebook Pixel:', error);
  }
};

// Evento de vista de página
export const trackPageView = (): void => {
  if (typeof window === 'undefined' || !isPixelInitialized || !window.fbq) {
    return;
  }

  try {
    window.fbq('track', 'PageView');
    if (import.meta.env.DEV) {
      console.log('FB Pixel: PageView tracked');
    }
  } catch (error) {
    console.error('Error al trackear PageView:', error);
  }
};

// Evento de inicio de formulario
export const trackFormStart = (): void => {
  if (typeof window === 'undefined' || !isPixelInitialized || !window.fbq) {
    return;
  }

  try {
    window.fbq('track', 'InitiateCheckout', {
      content_category: 'form',
      content_name: 'roadmap_ai_form'
    });
    if (import.meta.env.DEV) {
      console.log('FB Pixel: Form Start tracked');
    }
  } catch (error) {
    console.error('Error al trackear inicio de formulario:', error);
  }
};

// Evento de envío de formulario completado
export const trackFormSubmit = (value = 0): void => {
  if (typeof window === 'undefined' || !isPixelInitialized || !window.fbq) {
    return;
  }

  try {
    window.fbq('track', 'Lead', {
      content_name: 'roadmap_ai_lead',
      value: value,
      currency: 'COP'
    });
    if (import.meta.env.DEV) {
      console.log('FB Pixel: Lead tracked');
    }
  } catch (error) {
    console.error('Error al trackear envío de formulario:', error);
  }
};

// Eventos de CTA
export const trackCTAClick = (ctaName: string): void => {
  if (typeof window === 'undefined' || !isPixelInitialized || !window.fbq) {
    return;
  }

  try {
    window.fbq('track', 'ViewContent', {
      content_name: ctaName
    });
    if (import.meta.env.DEV) {
      console.log(`FB Pixel: CTA Click tracked - ${ctaName}`);
    }
  } catch (error) {
    console.error('Error al trackear CTA click:', error);
  }
};

// Evento de unirse a comunidad WhatsApp
export const trackJoinWhatsApp = (): void => {
  if (typeof window === 'undefined' || !isPixelInitialized || !window.fbq) {
    return;
  }

  try {
    window.fbq('track', 'Contact', {
      content_category: 'whatsapp',
      content_name: 'join_whatsapp_community'
    });
    if (import.meta.env.DEV) {
      console.log('FB Pixel: Join WhatsApp tracked');
    }
  } catch (error) {
    console.error('Error al trackear unión a WhatsApp:', error);
  }
};

// Evento de scroll a sección
export const trackSectionView = (sectionName: string): void => {
  if (typeof window === 'undefined' || !isPixelInitialized || !window.fbq) {
    return;
  }

  try {
    window.fbq('trackCustom', 'SectionView', {
      section_name: sectionName
    });
    if (import.meta.env.DEV) {
      console.log(`FB Pixel: Section View tracked - ${sectionName}`);
    }
  } catch (error) {
    console.error('Error al trackear vista de sección:', error);
  }
};