// src/lib/facebook-pixel.ts

// Validar que fbq está disponible
const isFbqDefined = (): boolean => {
    return typeof window !== 'undefined' && typeof window.fbq === 'function';
  };
  
  // Evento de vista de página básico
  export const trackPageView = (): void => {
    if (isFbqDefined()) {
      window.fbq('track', 'PageView');
    } else {
      console.warn('Facebook Pixel not loaded');
    }
  };
  
  // Evento de inicio de formulario
  export const trackFormStart = (): void => {
    if (isFbqDefined()) {
      window.fbq('track', 'InitiateCheckout', {
        content_category: 'form',
        content_name: 'roadmap_ai_form'
      });
      console.log('FB Pixel: Form Start tracked');
    } else {
      console.warn('Facebook Pixel not loaded');
    }
  };
  
  // Evento de envío de formulario completado
  export const trackFormSubmit = (value = 0): void => {
    if (isFbqDefined()) {
      window.fbq('track', 'Lead', {
        content_name: 'roadmap_ai_lead',
        value: value,
        currency: 'COP'
      });
      console.log('FB Pixel: Lead tracked');
    } else {
      console.warn('Facebook Pixel not loaded');
    }
  };
  
  // Eventos de CTA
  export const trackCTAClick = (ctaName: string): void => {
    if (isFbqDefined()) {
      window.fbq('track', 'ViewContent', {
        content_name: ctaName
      });
      console.log(`FB Pixel: CTA Click tracked - ${ctaName}`);
    } else {
      console.warn('Facebook Pixel not loaded');
    }
  };
  
  // Evento de unirse a comunidad WhatsApp
  export const trackJoinWhatsApp = (): void => {
    if (isFbqDefined()) {
      window.fbq('track', 'Contact', {
        content_category: 'whatsapp',
        content_name: 'join_whatsapp_community'
      });
      console.log('FB Pixel: Join WhatsApp tracked');
    } else {
      console.warn('Facebook Pixel not loaded');
    }
  };
  
  // Evento de scroll a sección
  export const trackSectionView = (sectionName: string): void => {
    if (isFbqDefined()) {
      window.fbq('trackCustom', 'SectionView', {
        section_name: sectionName
      });
      console.log(`FB Pixel: Section View tracked - ${sectionName}`);
    } else {
      console.warn('Facebook Pixel not loaded');
    }
  };