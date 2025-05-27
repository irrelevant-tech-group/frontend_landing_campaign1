import mixpanel from 'mixpanel-browser';
import type { MixpanelProperties } from './mixpanel-types';

// Inicialización de Mixpanel
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || '';

// Variable para controlar si Mixpanel está inicializado
let isMixpanelInitialized = false;

// Función para inicializar Mixpanel de forma segura
const initMixpanel = () => {
  if (typeof window === 'undefined' || isMixpanelInitialized) {
    return;
  }

  if (!MIXPANEL_TOKEN) {
    console.warn('⚠️ Mixpanel token is not configured. Analytics will be disabled.');
    return;
  }

  try {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: import.meta.env.DEV,
      track_pageview: false, // Desactivar pageview automático
      persistence: 'localStorage',
      property_blacklist: ['$current_url', '$initial_referrer', '$referrer'],
      cross_site_cookie: false,
      secure_cookie: true,
      ignore_dnt: false,
    });
    
    isMixpanelInitialized = true;
    
    // Log de inicialización solo en desarrollo
    if (import.meta.env.DEV) {
      console.log('🚀 Mixpanel initialized with token:', MIXPANEL_TOKEN.substring(0, 8) + '...');
    }
  } catch (error) {
    console.error('Error initializing Mixpanel:', error);
  }
};

// Inicializar cuando se carga el módulo (solo si estamos en el navegador)
if (typeof window !== 'undefined') {
  initMixpanel();
}

// Funciones auxiliares para trackear eventos
export const trackEvent = (eventName: string, properties?: MixpanelProperties) => {
  // Verificar si estamos en el navegador y si Mixpanel está disponible
  if (typeof window === 'undefined' || !MIXPANEL_TOKEN || !isMixpanelInitialized) {
    if (import.meta.env.DEV) {
      console.log('📊 Mixpanel Event (disabled):', eventName, properties);
    }
    return;
  }

  try {
    const eventData = {
      ...properties,
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE,
    };
    
    mixpanel.track(eventName, eventData);
    
    // Log para debugging - solo en desarrollo
    if (import.meta.env.DEV) {
      console.log('📊 Mixpanel Event:', eventName, eventData);
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Función para identificar usuarios
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window === 'undefined' || !MIXPANEL_TOKEN || !isMixpanelInitialized) {
    return;
  }

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
  if (typeof window === 'undefined' || !MIXPANEL_TOKEN || !isMixpanelInitialized) {
    return;
  }

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
  if (typeof window === 'undefined' || !MIXPANEL_TOKEN || !isMixpanelInitialized) {
    return;
  }

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