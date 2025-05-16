import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Clock, MessageSquare, DollarSign, Users, Settings, CreditCard, Headphones, Brain, FileText, ChevronRight, MapPin, Phone, Mail, User, Building2, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  trackFormStarted, 
  trackFormStepCompleted, 
  trackFormSubmitted, 
  trackWhatsappProvided, 
  trackScrolledToSection 
} from '@/lib/mixpanel-events';

// URL del backend - Ajusta según tu entorno
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Link de la comunidad de WhatsApp
const WHATSAPP_COMMUNITY_LINK = 'https://chat.whatsapp.com/JMSMme18JN9B6zHdRC6ZGg';

interface Question {
  id: number;
  text: string;
  description?: string;
  type: 'multi-select' | 'single-select' | 'contact-form';
  required?: boolean;
  options?: {
    id: string;
    text: string;
    icon?: any;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "¿En qué área quieres mejorar procesos con IA?",
    description: "Elige el área donde sientes que la automatización puede tener más impacto",
    type: "multi-select",
    required: true,
    options: [
      { id: "ventas", text: "Ventas", icon: DollarSign },
      { id: "operaciones", text: "Operaciones", icon: Settings },
      { id: "facturacion", text: "Facturación", icon: CreditCard },
      { id: "atencion", text: "Atención al cliente", icon: Headphones },
      { id: "talento", text: "Contabilidad", icon: Users },
      { id: "legal", text: "Legal", icon: Brain }
    ]
  },
  {
    id: 2,
    text: "¿Qué tipo de tareas te quitan más tiempo hoy?",
    description: "Identifica el mayor cuello de botella en tu día a día",
    type: "multi-select",
    required: true,
    options: [
      { id: "cotizar", text: "Cotizar", icon: FileText },
      { id: "pagos", text: "Revisar pagos", icon: DollarSign },
      { id: "clientes", text: "Responder clientes", icon: MessageSquare },
      { id: "facturas", text: "Subir facturas", icon: CreditCard },
      { id: "organizar", text: "Organizar información", icon: Settings },
      { id: "otra", text: "Otra tarea", icon: Clock }
    ]
  },
  {
    id: 3,
    text: "¿Qué herramientas usas actualmente en tu empresa?",
    description: "Selecciona todas las que apliquen",
    type: "multi-select",
    required: true,
    options: [
      { id: "whatsapp", text: "WhatsApp", icon: MessageSquare },
      { id: "excel", text: "Excel o Google Sheets", icon: FileText },
      { id: "siigo", text: "Siigo", icon: DollarSign },
      { id: "crm", text: "CRM", icon: Users },
      { id: "drive", text: "Google Drive", icon: Brain },
      { id: "shopify", text: "Shopify", icon: Settings },
      { id: "otra", text: "Otra herramienta", icon: ChevronRight }
    ]
  },
  {
    id: 4,
    text: "¿Cuál es el mayor desafío operativo en tu empresa?",
    description: "Elige el problema que más afecta tu productividad",
    type: "multi-select",
    required: true,
    options: [
      { id: "tiempos", text: "Tiempos de respuesta lentos", icon: Clock },
      { id: "costos", text: "Costos operativos crecientes", icon: DollarSign },
      { id: "escalabilidad", text: "Dificultad para escalar", icon: TrendingUp },
      { id: "manual", text: "Demasiado trabajo manual", icon: Settings },
      { id: "informacion", text: "Información desorganizada", icon: Brain },
      { id: "otro", text: "Otro desafío", icon: AlertCircle }
    ]
  },
  {
    id: 5,
    text: "¿Cuántas personas trabajan en tu empresa?",
    description: "Tamaño aproximado de tu equipo",
    type: "single-select",
    required: true,
    options: [
      { id: "1-5", text: "1-5 personas", icon: Users },
      { id: "6-15", text: "6-15 personas", icon: Users },
      { id: "16-50", text: "16-50 personas", icon: Users },
      { id: "50+", text: "Más de 50 personas", icon: Users }
    ]
  },
  {
    id: 6,
    text: "Tu información de contacto",
    description: "Para enviarte tu roadmap personalizado",
    type: "contact-form",
    required: true
  }
];

interface FormData {
  [key: number]: string[] | string;
  contactInfo: {
    name: string;
    company: string;
    email: string;
    phone: string;
  };
}

const FormSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    contactInfo: {
      name: '',
      company: '',
      email: '',
      phone: ''
    }
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  
  // Tracking refs
  const formStartTime = useRef<number>(Date.now());
  const stepStartTime = useRef<number>(Date.now());
  const hasTrackedFormStart = useRef<boolean>(false);
  const hasTrackedSection = useRef<boolean>(false);
  const pageLoadTime = useRef(Date.now());
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        
        // Trackear cuando el usuario llega a la sección del formulario
        if (entry.isIntersecting && !hasTrackedSection.current) {
          hasTrackedSection.current = true;
          const timeOnPage = (Date.now() - pageLoadTime.current) / 1000;
          trackScrolledToSection('form', 3, timeOnPage);
          
          // También trackear form_started si el usuario llega a ver el formulario
          if (!hasTrackedFormStart.current) {
            hasTrackedFormStart.current = true;
            trackFormStarted('main-form', questions.length);
          }
        }
      },
      { threshold: 0.3 }
    );
    
    if (formRef.current) observer.observe(formRef.current);
    return () => {
      if (formRef.current) observer.unobserve(formRef.current);
    };
  }, []);
  
  // Efecto para ajustar altura mínima en dispositivos móviles
  useEffect(() => {
    const updateMinHeight = () => {
      if (formRef.current) {
        const viewportHeight = window.innerHeight;
        // Ajustar altura mínima para evitar problemas en móviles
        document.documentElement.style.setProperty('--viewport-height', `${viewportHeight}px`);
      }
    };
    
    // Actualizar al cargar y en cambio de tamaño
    updateMinHeight();
    window.addEventListener('resize', updateMinHeight);
    window.addEventListener('orientationchange', updateMinHeight);
    
    return () => {
      window.removeEventListener('resize', updateMinHeight);
      window.removeEventListener('orientationchange', updateMinHeight);
    };
  }, []);
  
  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  
  const handleSingleSelect = (value: string) => {
    // Trackear la selección del paso actual
    const timeOnStep = (Date.now() - stepStartTime.current) / 1000;
    trackFormStepCompleted(
      currentStep + 1,
      currentQuestion.text,
      [value],
      timeOnStep,
      currentQuestion.required
    );
    
    setFormData({ ...formData, [currentQuestion.id]: value });
    
    // Reset timer para el siguiente paso
    stepStartTime.current = Date.now();
    
    // Auto-advance only for single-select questions
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 500);
  };

  const handleMultiSelect = (value: string) => {
    const currentValues = (formData[currentQuestion.id] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setFormData({ ...formData, [currentQuestion.id]: newValues });
  };
  
  const handleContactChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      contactInfo: {
        ...formData.contactInfo,
        [field]: value
      }
    });
    
    // Trackear cuando se proporciona WhatsApp
    if (field === 'phone' && value && !formData.contactInfo.phone) {
      trackWhatsappProvided(value, {
        name: formData.contactInfo.name,
        email: formData.contactInfo.email,
        company: formData.contactInfo.company
      });
    }
  };
  
  const handleNext = () => {
    // Trackear el paso completado
    const timeOnStep = (Date.now() - stepStartTime.current) / 1000;
    const currentAnswer = formData[currentQuestion.id];
    const selectedOptions = Array.isArray(currentAnswer) ? currentAnswer : [];
    
    trackFormStepCompleted(
      currentStep + 1,
      currentQuestion.text,
      selectedOptions,
      timeOnStep,
      currentQuestion.required
    );
    
    // Reset timer para el siguiente paso
    stepStartTime.current = Date.now();
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      stepStartTime.current = Date.now();
    }
  };
  
  const canProceed = () => {
    if (currentQuestion.type === 'contact-form') {
      return formData.contactInfo.name.trim() && 
             formData.contactInfo.company.trim() && 
             formData.contactInfo.email.trim();
    }
    
    const value = formData[currentQuestion.id];
    if (!currentQuestion.required) return true;
    
    if (currentQuestion.type === 'multi-select') {
      return value && (value as string[]).length > 0;
    }
    
    return value && value !== '';
  };
  
  const handleSubmit = async () => {
    if (!canProceed() || isSubmitting) return;
    
    try {
      // Indicar que estamos procesando
      setIsSubmitting(true);
      
      // Trackear el último paso completado
      const timeOnStep = (Date.now() - stepStartTime.current) / 1000;
      trackFormStepCompleted(
        currentStep + 1,
        currentQuestion.text,
        [],
        timeOnStep,
        currentQuestion.required
      );
      
      // Preparar y trackear el envío completo del formulario
      const totalCompletionTime = (Date.now() - formStartTime.current) / 1000;
      
      // Crear objeto de respuestas para tracking
      const selectedAnswers: Record<string, string | string[]> = {};
      questions.forEach((question) => {
        if (question.type !== 'contact-form' && formData[question.id]) {
          selectedAnswers[question.text] = formData[question.id];
        }
      });
      
      // Trackear el envío completo
      trackFormSubmitted(
        questions.length,
        totalCompletionTime,
        formData.contactInfo,
        selectedAnswers
      );
      
      // Preparar datos para enviar al backend
      const payload = {
        contactInfo: formData.contactInfo,
        responses: {
          areasToImprove: Array.isArray(formData[1]) ? formData[1] : [],
          timeConsumingTasks: Array.isArray(formData[2]) ? formData[2] : [],
          currentTools: Array.isArray(formData[3]) ? formData[3] : [],
          operationalChallenges: Array.isArray(formData[4]) ? formData[4] : [],
          companySize: formData[5] as string
        }
      };
      
      // Log para depuración
      console.log('Enviando datos al backend:', payload);
      
      // Realizar la llamada a la API
      const response = await fetch(`${BACKEND_URL}/api/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      // Verificar si la respuesta fue exitosa
      if (response.ok) {
        console.log('Respuesta del servidor:', data);
        
        // Actualizar la UI
        setIsSubmitted(true);
        toast.success(data.message || "¡Roadmap generado! Revisa tu email en las próximas 24 horas", {
          position: "bottom-right",
        });
      } else {
        // Manejar errores del servidor
        console.error('Error del servidor:', data);
        toast.error(data.message || "Error al enviar. Por favor intenta nuevamente.", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      // Manejar errores de red o excepciones
      console.error('Error en la solicitud:', error);
      toast.error("Error de conexión. Por favor verifica tu conexión a internet e intenta nuevamente.", {
        position: "bottom-right",
      });
    } finally {
      // Desactivar indicador de carga
      setIsSubmitting(false);
    }
  };
  
  return (
    <section id="form-section" className="py-10 sm:py-20 px-4" ref={formRef}>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isIntersecting ? 1 : 0, y: isIntersecting ? 0 : 20 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-future-white to-cyan-300 bg-clip-text text-transparent">
                  Obtén tu roadmap personalizado
                </span>
              </h2>
              <p className="mt-2 sm:mt-4 text-base sm:text-lg text-future-white/80">
                Responde como si hablaras con tu socio. Te devolvemos un plan real y accionable.
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6 sm:mb-10">
              <div className="flex justify-between text-sm text-cosmic-light/70 mb-2">
                <span>Paso {currentStep + 1} de {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 sm:h-3 bg-electric-purple/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-electric-purple via-neon-purple to-cyan-400 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full animate-pulse"></div>
                </motion.div>
              </div>
            </div>
            
            {/* Form Content */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-electric-purple/5 rounded-xl sm:rounded-3xl blur-3xl" />
              <div className="relative bg-void-dark/90 backdrop-blur-sm p-5 sm:p-8 md:p-12 rounded-xl sm:rounded-3xl border border-cyan-400/20 shadow-[0_0_40px_rgba(103,232,249,0.1)]">
                {!isSubmitted ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="min-h-[350px] sm:min-h-[400px] flex flex-col"
                      style={{ minHeight: 'min(400px, calc(var(--viewport-height) * 0.6))' }}
                    >
                      {/* Question */}
                      <div className="mb-5 sm:mb-8">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-future-white mb-2 sm:mb-3">
                          {currentQuestion.text}
                        </h3>
                        {currentQuestion.description && (
                          <p className="text-future-white/70 text-base sm:text-lg">
                            {currentQuestion.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Answer Options or Contact Form */}
                      <div className="flex-1">
                        {currentQuestion.type === 'contact-form' ? (
                          <div className="max-w-2xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                              <div>
                                <label className="block text-sm font-medium text-future-white/90 mb-1 sm:mb-2">
                                  Tu nombre completo *
                                </label>
                                <input
                                  type="text"
                                  value={formData.contactInfo.name}
                                  onChange={(e) => handleContactChange('name', e.target.value)}
                                  placeholder="Ej: Juan Pérez"
                                  className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-void-dark/70 border border-cyan-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all text-future-white placeholder:text-future-white/40"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-future-white/90 mb-1 sm:mb-2">
                                  Nombre de tu empresa *
                                </label>
                                <input
                                  type="text"
                                  value={formData.contactInfo.company}
                                  onChange={(e) => handleContactChange('company', e.target.value)}
                                  placeholder="Ej: Mi Empresa SAS"
                                  className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-void-dark/70 border border-cyan-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all text-future-white placeholder:text-future-white/40"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-future-white/90 mb-1 sm:mb-2">
                                  Tu correo electrónico *
                                </label>
                                <input
                                  type="email"
                                  value={formData.contactInfo.email}
                                  onChange={(e) => handleContactChange('email', e.target.value)}
                                  placeholder="tu@empresa.com"
                                  className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-void-dark/70 border border-cyan-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all text-future-white placeholder:text-future-white/40"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-future-white/90 mb-1 sm:mb-2">
                                  WhatsApp (opcional pero recomendado)
                                </label>
                                <input
                                  type="tel"
                                  value={formData.contactInfo.phone}
                                  onChange={(e) => handleContactChange('phone', e.target.value)}
                                  placeholder="+57 312 345 6789"
                                  className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-void-dark/70 border border-cyan-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all text-future-white placeholder:text-future-white/40"
                                />
                                <div className="mt-2 p-2 sm:p-3 bg-cyan-400/10 rounded-lg border border-cyan-400/20">
                                  <p className="text-sm text-cyan-400 font-medium mb-1">
                                    🎯 Al dejar tu WhatsApp obtienes:
                                  </p>
                                  <ul className="text-xs sm:text-sm text-future-white/80 space-y-1">
                                    <li>• Acceso inmediato a nuestra comunidad de WhatsApp</li>
                                    <li>• Herramientas diarias + cómo usarlas en tu empresa</li>
                                    <li>• Entrada al irrelevant club (red de +30 empresas)</li>
                                  </ul>
                                  <p className="text-xs text-future-white/60 mt-1 sm:mt-2">
                                    Solo contenido de valor, cero spam ✓
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : currentQuestion.options && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            {currentQuestion.options.map((option) => (
                              <motion.button
                                key={option.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => currentQuestion.type === 'single-select' 
                                  ? handleSingleSelect(option.id) 
                                  : handleMultiSelect(option.id)}
                                className={`relative p-3 sm:p-5 rounded-lg sm:rounded-xl border transition-all duration-300 text-left ${
                                  currentQuestion.type === 'single-select' && formData[currentQuestion.id] === option.id
                                    ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(103,232,249,0.2)]'
                                    : currentQuestion.type === 'multi-select' && ((formData[currentQuestion.id] as string[]) || []).includes(option.id)
                                    ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(103,232,249,0.2)]'
                                    : 'border-cyan-400/20 hover:border-cyan-400/40 hover:bg-cyan-400/5'
                                }`}
                              >
                                <div className="flex items-center gap-3 sm:gap-4">
                                  {option.icon && (
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                                      <option.icon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                                    </div>
                                  )}
                                  <span className="text-future-white text-base sm:text-lg">{option.text}</span>
                                  {((currentQuestion.type === 'single-select' && formData[currentQuestion.id] === option.id) ||
                                    (currentQuestion.type === 'multi-select' && ((formData[currentQuestion.id] as string[]) || []).includes(option.id))) && (
                                    <Check className="absolute right-3 sm:right-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                                  )}
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Navigation */}
                      <div className="mt-6 sm:mt-8 flex justify-between items-center">
                        <Button
                          onClick={handleBack}
                          variant="ghost"
                          className={`text-future-white/70 hover:text-future-white text-sm sm:text-base ${currentStep === 0 ? 'invisible' : ''}`}
                          disabled={currentStep === 0}
                        >
                          Atrás
                        </Button>
                        
                        {currentStep === questions.length - 1 ? (
                          <Button
                            onClick={handleSubmit}
                            disabled={!canProceed() || isSubmitting}
                            className="bg-gradient-to-r from-electric-purple to-cyan-400 hover:from-electric-purple/90 hover:to-cyan-400/90 text-future-white px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(103,232,249,0.3)] disabled:opacity-50 group"
                          >
                            {isSubmitting ? (
                              <>
                                <span className="animate-pulse">Procesando...</span>
                                <div className="ml-2 w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              </>
                            ) : (
                              <>
                                Generar mi roadmap
                                <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </Button>
                        ) : currentQuestion.type === 'multi-select' || currentQuestion.type === 'contact-form' ? (
                          <Button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="bg-cyan-400 hover:bg-cyan-500 text-void-dark px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(103,232,249,0.3)] disabled:opacity-50 group"
                          >
                            Siguiente
                            <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        ) : null}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8 sm:py-12"
                  >
                    <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-electric-purple to-cyan-400 flex items-center justify-center">
  <Check className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
</div>
<h3 className="text-2xl sm:text-3xl font-bold text-future-white mb-3 sm:mb-4">
  ¡Roadmap generado!
</h3>
<p className="text-future-white/80 max-w-md mx-auto text-base sm:text-lg">
  Te enviaremos tu estrategia personalizada a 
  <span className="text-cyan-400 font-medium"> {formData.contactInfo.email}</span> 
  <span className="block mt-2">en las próximas 24 horas.</span>
</p>

<div className="mt-4 sm:mt-6 px-4 py-3 sm:px-6 sm:py-4 rounded-lg sm:rounded-xl bg-cyan-400/10 border border-cyan-400/20 max-w-md mx-auto">
  <p className="text-sm text-future-white/90 mb-2">
    <AlertCircle className="w-4 h-4 inline-block mr-2 text-cyan-400" />
    <span className="font-medium">Importante:</span> Recuerda revisar la carpeta de SPAM si no ves nuestro email.
  </p>
</div>

<div className="mt-6 sm:mt-8">
  <a
    href={WHATSAPP_COMMUNITY_LINK}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
  >
    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
    Unirse a OS By irrelevant
  </a>
  <p className="mt-3 text-xs sm:text-sm text-future-white/60 max-w-md mx-auto">
    Comunidad 100% gratuita donde enseñamos herramientas de tecnología, procesos automatizables y cómo implementarlos sin morir en el intento.
  </p>
</div>

<div className="mt-6 text-sm text-future-white/60">
  Síguenos en redes para más tips de automatización
</div>
</motion.div>
)}
</div>
</div>

{/* Footer */}
<div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-future-white/60">
  Al completar este formulario aceptas recibir comunicaciones de irrelevant. 
  <br />Respetamos tu privacidad y nunca compartiremos tus datos.
</div>
</motion.div>
</div>
</div>
</section>
);
};

export default FormSection;
                      