// src/types/facebook-pixel.d.ts

// Definición de ventana global para Facebook Pixel
interface Window {
    fbq: (
      action: string,
      eventName: string,
      params?: Record<string, any>
    ) => void;
    _fbq: any;
  }
  
  // Definición para react-facebook-pixel
  declare module 'react-facebook-pixel' {
    interface Options {
      autoConfig?: boolean;
      debug?: boolean;
    }
  
    export function init(
      pixelId: string,
      advancedMatching?: object,
      options?: Options
    ): void;
    
    export function pageView(): void;
    
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
      event: string,
      data?: Record<string, any>
    ): void;
    
    const ReactPixel: {
      init: typeof init;
      pageView: typeof pageView;
      track: typeof track;
      trackCustom: typeof trackCustom;
      fbq: typeof fbq;
    };
    
    export default ReactPixel;
  }