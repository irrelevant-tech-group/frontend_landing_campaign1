// src/types/facebook-pixel.d.ts

// Definición extendida de ventana global para Facebook Pixel
interface Window {
  fbq: FacebookPixelFunction & {
    callMethod?: (...args: any[]) => void;
    queue: any[];
    push: (item: any) => void;
    loaded: boolean;
    version: string;
  };
  _fbq: any;
}

// Definición de la función principal del pixel
interface FacebookPixelFunction {
  (action: 'track', eventName: string, params?: Record<string, any>): void;
  (action: 'trackCustom', eventName: string, params?: Record<string, any>): void;
  (action: 'init', pixelId: string, params?: Record<string, any>): void;
  (action: 'consent', consentType: string): void;
  (action: string, ...args: any[]): void;
}

// Tipos para eventos estándar de Facebook
interface FacebookStandardEvents {
  PageView: Record<string, any>;
  ViewContent: {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    value?: number;
    currency?: string;
  };
  Search: {
    search_string?: string;
    content_category?: string;
    content_ids?: string[];
    value?: number;
    currency?: string;
  };
  AddToCart: {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    value?: number;
    currency?: string;
  };
  AddToWishlist: {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    value?: number;
    currency?: string;
  };
  InitiateCheckout: {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    value?: number;
    currency?: string;
    num_items?: number;
  };
  AddPaymentInfo: {
    content_category?: string;
    content_ids?: string[];
    value?: number;
    currency?: string;
  };
  Purchase: {
    content_name?: string;
    content_ids?: string[];
    content_type?: string;
    value: number;
    currency: string;
    num_items?: number;
  };
  Lead: {
    content_name?: string;
    content_category?: string;
    value?: number;
    currency?: string;
  };
  CompleteRegistration: {
    content_name?: string;
    status?: string;
    value?: number;
    currency?: string;
  };
  Contact: {
    content_name?: string;
    content_category?: string;
  };
  CustomizeProduct: {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    value?: number;
    currency?: string;
  };
  Donate: {
    content_name?: string;
    content_category?: string;
    value?: number;
    currency?: string;
  };
  FindLocation: {
    content_name?: string;
    content_category?: string;
  };
  Schedule: {
    content_name?: string;
    content_category?: string;
  };
  StartTrial: {
    content_name?: string;
    content_category?: string;
    value?: number;
    currency?: string;
  };
  SubmitApplication: {
    content_name?: string;
    content_category?: string;
  };
  Subscribe: {
    content_name?: string;
    content_category?: string;
    value?: number;
    currency?: string;
  };
}

// Tipo union para nombres de eventos estándar
type StandardEventName = keyof FacebookStandardEvents;

// Definición para react-facebook-pixel (manteniendo compatibilidad)
declare module 'react-facebook-pixel' {
  interface Options {
    autoConfig?: boolean;
    debug?: boolean;
    xfbml?: boolean;
    version?: string;
  }

  interface AdvancedMatching {
    em?: string; // email
    ph?: string; // phone
    fn?: string; // first name
    ln?: string; // last name
    db?: string; // date of birth
    ge?: string; // gender
    ct?: string; // city
    st?: string; // state
    zp?: string; // zip code
    country?: string;
  }

  export function init(
    pixelId: string,
    advancedMatching?: AdvancedMatching,
    options?: Options
  ): void;
  
  export function pageView(): void;
  
  export function track<T extends StandardEventName>(
    event: T,
    data?: FacebookStandardEvents[T]
  ): void;
  
  export function track(
    event: string,
    data?: Record<string, any>
  ): void;
  
  export function trackCustom(
    event: string,
    data?: Record<string, any>
  ): void;
  
  export function fbq(
    action: string,
    event?: string,
    data?: Record<string, any>
  ): void;

  export function trackSingle(
    pixelId: string,
    event: string,
    data?: Record<string, any>
  ): void;

  export function trackSingleCustom(
    pixelId: string,
    event: string,
    data?: Record<string, any>
  ): void;

  export function grantConsent(): void;
  export function revokeConsent(): void;
  
  const ReactPixel: {
    init: typeof init;
    pageView: typeof pageView;
    track: typeof track;
    trackCustom: typeof trackCustom;
    trackSingle: typeof trackSingle;
    trackSingleCustom: typeof trackSingleCustom;
    fbq: typeof fbq;
    grantConsent: typeof grantConsent;
    revokeConsent: typeof revokeConsent;
  };
  
  export default ReactPixel;
}

// Declaración global para TypeScript
declare global {
  interface Window {
    fbq: FacebookPixelFunction & {
      callMethod?: (...args: any[]) => void;
      queue: any[];
      push: (item: any) => void;
      loaded: boolean;
      version: string;
    };
    _fbq: any;
  }
}

// Tipos adicionales para uso interno
export interface FacebookPixelConfig {
  pixelId: string;
  options?: {
    autoConfig?: boolean;
    debug?: boolean;
  };
  advancedMatching?: {
    em?: string;
    ph?: string;
    fn?: string;
    ln?: string;
  };
}

export interface FacebookPixelEvent {
  name: string;
  parameters?: Record<string, any>;
  customParameters?: Record<string, any>;
}

// Export para que TypeScript reconozca el módulo
export {};