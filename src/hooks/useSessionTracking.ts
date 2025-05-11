import { useEffect } from 'react';
import { trackSessionStarted } from '@/lib/mixpanel-events';

export const useSessionTracking = () => {
  useEffect(() => {
    // Trackear cuando se inicia la sesión (component mount)
    const handleSessionStart = () => {
      trackSessionStarted();
    };

    // Ejecutar inmediatamente
    handleSessionStart();

    // Opcional: trackear si el usuario vuelve a la pestaña
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        trackSessionStarted();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};