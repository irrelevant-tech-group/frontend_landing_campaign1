import ReactPixel from 'react-facebook-pixel';

// ID del Pixel de Facebook
const PIXEL_ID = '1272701517682286'; // Nuevo Pixel ID

// Opciones de configuración
const options = {
  autoConfig: true,
  debug: import.meta.env.DEV // Debug solo en desarrollo
};

// Función para inicializar el Pixel
export const initFacebookPixel = (): void => {
  if (typeof window !== 'undefined') {
    try {
      ReactPixel.init(PIXEL_ID, undefined, options);
      if (import.meta.env.DEV) {
        console.log('Facebook Pixel inicializado correctamente');
      }
    } catch (error) {
      console.error('Error al inicializar Facebook Pixel:', error);
    }
  }
};

// Evento de vista de página
export const trackPageView = (): void => {
  try {
    ReactPixel.pageView();
    if (import.meta.env.DEV) {
      console.log('FB Pixel: PageView tracked');
    }
  } catch (error) {
    console.error('Error al trackear PageView:', error);
  }
};

// Evento de inicio de formulario
export const trackFormStart = (): void => {
  try {
    ReactPixel.track('InitiateCheckout', {
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
  try {
    ReactPixel.track('Lead', {
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
  try {
    ReactPixel.track('ViewContent', {
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
  try {
    ReactPixel.track('Contact', {
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
  try {
    ReactPixel.trackCustom('SectionView', {
      section_name: sectionName
    });
    if (import.meta.env.DEV) {
      console.log(`FB Pixel: Section View tracked - ${sectionName}`);
    }
  } catch (error) {
    console.error('Error al trackear vista de sección:', error);
  }
};