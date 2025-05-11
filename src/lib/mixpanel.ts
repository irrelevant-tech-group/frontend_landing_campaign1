import mixpanel from 'mixpanel-browser';
import type { MixpanelProperties } from './mixpanel-types';

// Inicialización de Mixpanel
// Reemplaza 'YOUR_MIXPANEL_TOKEN' con tu token real de Mixpanel
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || '';

if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: import.meta.env.DEV,
    track_pageview: true,
    persistence: 'localStorage',
    property_blacklist: ['$current_url', '$initial_referrer', '$referrer'],
    cross_site_cookie: false,
    secure_cookie: true,
    ignore_dnt: false,
  });
  
  // Log de inicialización
  if (import.meta.env.DEV) {
    console.log('🚀 Mixpanel initialized with token:', MIXPANEL_TOKEN.substring(0, 8) + '...');
  }
} else {
  console.warn('⚠️ Mixpanel token is not configured. Check your .env file');
}

// Funciones auxiliares para trackear eventos
export const trackEvent = (eventName: string, properties?: MixpanelProperties) => {
  if (!MIXPANEL_TOKEN) {
    console.warn('Mixpanel token is not set');
    return;
  }

  try {
    const eventData = {
      ...properties,
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE,
    };
    
    mixpanel.track(eventName, eventData);
    
    // Log para debugging - remover en producción
    if (import.meta.env.DEV) {
      console.log('📊 Mixpanel Event:', eventName, eventData);
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Función para identificar usuarios
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (!MIXPANEL_TOKEN) return;

  try {
    mixpanel.identify(userId);
    if (properties) {
      mixpanel.people.set(properties);
    }
    
    // Log para debugging
    if (import.meta.env.DEV) {
      console.log('👤 Mixpanel Identify:', userId, properties);
    }
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};

// Función para registrar propiedades del usuario
export const setUserProperties = (properties: Record<string, any>) => {
  if (!MIXPANEL_TOKEN) return;

  try {
    mixpanel.people.set(properties);
    
    // Log para debugging
    if (import.meta.env.DEV) {
      console.log('🔧 Mixpanel User Properties:', properties);
    }
  } catch (error) {
    console.error('Error setting user properties:', error);
  }
};

// Función para reset del usuario
export const resetUser = () => {
  if (!MIXPANEL_TOKEN) return;

  try {
    mixpanel.reset();
    
    // Log para debugging
    if (import.meta.env.DEV) {
      console.log('🔄 Mixpanel User Reset');
    }
  } catch (error) {
    console.error('Error resetting user:', error);
  }
};

export default mixpanel;