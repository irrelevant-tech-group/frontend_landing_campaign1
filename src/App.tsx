import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useSessionTracking } from "@/hooks/useSessionTracking";
import { useEffect } from 'react';
import { initFacebookPixel, trackPageView } from '@/lib/facebook-pixel';

const queryClient = new QueryClient();

// Componente interno para envolver el contenido y aplicar sesión tracking
const AppContent = () => {
  // Hook para trackear sesiones automáticamente
  useSessionTracking();
  
  // Inicializar y trackear vista de página con Facebook Pixel
  useEffect(() => {
    initFacebookPixel(); // Inicializar el Pixel al montar la aplicación
    trackPageView();
  }, []);
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;