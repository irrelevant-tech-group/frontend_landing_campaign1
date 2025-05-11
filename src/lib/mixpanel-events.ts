import { trackEvent } from './mixpanel';
import type { 
  SessionStartedProperties,
  HeroCTAClickProperties,
  ScrolledToSectionProperties,
  FormStartedProperties,
  FormStepCompletedProperties,
  FormSubmittedProperties,
  WhatsappProvidedProperties
} from './mixpanel-types';

// Función para obtener información del dispositivo
const getDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
  const userAgent = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
  return 'desktop';
};

// Función para obtener parámetros UTM de la URL
const getUTMParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
  };
};

// Evento: session_started
export const trackSessionStarted = () => {
  const properties: SessionStartedProperties = {
    referrer: document.referrer || 'direct',
    ...getUTMParams(),
    device_type: getDeviceType(),
    page_title: document.title,
    page_path: window.location.pathname,
  };
  
  trackEvent('session_started', properties);
};

// Evento: hero_cta_click
export const trackHeroCTAClick = (
  ctaText: string, 
  ctaLocation: 'hero' | 'footer' = 'hero',
  scrollDepth?: number
) => {
  const properties: HeroCTAClickProperties = {
    cta_text: ctaText,
    cta_location: ctaLocation,
    scroll_depth: scrollDepth || (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
  };
  
  trackEvent('hero_cta_click', properties);
};

// Evento: scrolled_to_section
export const trackScrolledToSection = (
  sectionName: string,
  sectionPosition: number,
  timeOnPage: number
) => {
  const properties: ScrolledToSectionProperties = {
    section_name: sectionName,
    section_position: sectionPosition,
    scroll_depth: (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
    time_on_page: timeOnPage,
  };
  
  trackEvent('scrolled_to_section', properties);
};

// Evento: form_started
export const trackFormStarted = (
  formSection: string,
  questionCount: number
) => {
  const properties: FormStartedProperties = {
    form_section: formSection,
    question_count: questionCount,
    scroll_depth: (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
  };
  
  trackEvent('form_started', properties);
};

// Evento: form_step_completed
export const trackFormStepCompleted = (
  stepNumber: number,
  stepQuestion: string,
  selectedOptions: string[],
  timeOnStep: number,
  isRequired: boolean = true
) => {
  const properties: FormStepCompletedProperties = {
    step_number: stepNumber,
    step_question: stepQuestion,
    selected_options: selectedOptions,
    time_on_step: timeOnStep,
    is_required: isRequired,
  };
  
  trackEvent('form_step_completed', properties);
};

// Evento: form_submitted
export const trackFormSubmitted = (
  totalSteps: number,
  completionTime: number,
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
  },
  selectedAnswers: Record<string, string | string[]>
) => {
  const properties: FormSubmittedProperties = {
    total_steps: totalSteps,
    completion_time: completionTime,
    provided_contact_info: {
      name: !!contactInfo.name,
      email: !!contactInfo.email,
      phone: !!contactInfo.phone,
      company: !!contactInfo.company,
    },
    selected_answers: selectedAnswers,
  };
  
  trackEvent('form_submitted', properties);
};

// Evento: whatsapp_provided
export const trackWhatsappProvided = (
  phoneNumber: string,
  contactInfo: {
    name: string;
    email: string;
    company: string;
  }
) => {
  // Extraer código de país si está presente
  const phoneCountryCode = phoneNumber.match(/^\+?(\d{1,3})/)?.[1] || 'unknown';
  
  const properties: WhatsappProvidedProperties = {
    phone_country_code: phoneCountryCode,
    provided_name: !!contactInfo.name,
    provided_email: !!contactInfo.email,
    provided_company: !!contactInfo.company,
  };
  
  trackEvent('whatsapp_provided', properties);
};