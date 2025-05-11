// Tipos base para propiedades de Mixpanel
export interface MixpanelProperties {
    [key: string]: any;
  }
  
  // Tipos específicos para cada evento
  export interface SessionStartedProperties extends MixpanelProperties {
    referrer: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    device_type: 'desktop' | 'mobile' | 'tablet';
    page_title: string;
    page_path: string;
  }
  
  export interface HeroCTAClickProperties extends MixpanelProperties {
    cta_text: string;
    cta_location: 'hero' | 'footer';
    scroll_depth: number;
  }
  
  export interface ScrolledToSectionProperties extends MixpanelProperties {
    section_name: string;
    section_position: number;
    scroll_depth: number;
    time_on_page: number;
  }
  
  export interface FormStartedProperties extends MixpanelProperties {
    form_section: string;
    question_count: number;
    scroll_depth: number;
  }
  
  export interface FormStepCompletedProperties extends MixpanelProperties {
    step_number: number;
    step_question: string;
    selected_options: string[];
    time_on_step: number;
    is_required: boolean;
  }
  
  export interface FormSubmittedProperties extends MixpanelProperties {
    total_steps: number;
    completion_time: number;
    provided_contact_info: {
      name: boolean;
      email: boolean;
      phone: boolean;
      company: boolean;
    };
    selected_answers: Record<string, string | string[]>;
  }
  
  export interface WhatsappProvidedProperties extends MixpanelProperties {
    phone_country_code: string;
    provided_name: boolean;
    provided_email: boolean;
    provided_company: boolean;
  }
  
  // Tipo union para todos los eventos posibles
  export type EventType = 
    | 'session_started'
    | 'hero_cta_click'
    | 'scrolled_to_section'
    | 'form_started'
    | 'form_step_completed'
    | 'form_submitted'
    | 'whatsapp_provided';
  
  // Mapa de tipos para cada evento
  export type EventPropertiesMap = {
    session_started: SessionStartedProperties;
    hero_cta_click: HeroCTAClickProperties;
    scrolled_to_section: ScrolledToSectionProperties;
    form_started: FormStartedProperties;
    form_step_completed: FormStepCompletedProperties;
    form_submitted: FormSubmittedProperties;
    whatsapp_provided: WhatsappProvidedProperties;
  };