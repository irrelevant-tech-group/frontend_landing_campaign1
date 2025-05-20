// src/types/facebook-pixel.d.ts
interface Window {
    fbq: (
      action: string,
      eventName: string,
      params?: Record<string, any>
    ) => void;
    _fbq: any;
  }