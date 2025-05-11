import { useEffect, useRef, useState } from 'react';
import { trackScrolledToSection } from '@/lib/mixpanel-events';

interface ScrollSection {
  id: string;
  name: string;
  element: HTMLElement;
  position: number;
}

export const useScrollTracking = (sections: Array<{ id: string; name: string }>) => {
  const [trackedSections] = useState<Set<string>>(new Set());
  const pageLoadTime = useRef(Date.now());
  const scrollSections = useRef<ScrollSection[]>([]);

  useEffect(() => {
    // Inicializar referencias a los elementos
    scrollSections.current = sections.map((section, index) => ({
      id: section.id,
      name: section.name,
      element: document.getElementById(section.id)!,
      position: index + 1,
    })).filter(section => section.element);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const timeOnPage = (Date.now() - pageLoadTime.current) / 1000;

      scrollSections.current.forEach((section) => {
        if (!section.element) return;

        const rect = section.element.getBoundingClientRect();
        const elementTop = rect.top + scrollPosition;
        const elementHeight = rect.height;

        // Verificar si el elemento está visible en el viewport
        const isVisible = rect.top < windowHeight && rect.bottom > 0;

        // Verificar si el usuario ha scrolleado hasta al menos el 30% del elemento
        const scrolledIntoSection = scrollPosition + windowHeight > elementTop + (elementHeight * 0.3);

        if (scrolledIntoSection && isVisible && !trackedSections.has(section.id)) {
          trackedSections.add(section.id);
          trackScrolledToSection(section.name, section.position, timeOnPage);
        }
      });
    };

    // Agregar eventos de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Ejecutar una vez al montar para verificar elementos ya visibles
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
};