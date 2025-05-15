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
      { id: "talento", text: "Talento", icon: Users },
      { id: "otra", text: "Otra", icon: Brain }
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
      { id: "notion", text: "Notion", icon: Brain },
      { id: "trello", text: "Trello", icon: Settings },
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
      
      console.log('BACKEND_URLLLLLLL',BACKEND_URL);
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
      console.log('DATAAAAA',data);
      console.log('RESPONSEEEE',response);
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
    <section id="form-section" className="py-20 px-4" ref={formRef}>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isIntersecting ? 1 : 0, y: isIntersecting ? 0 : 20 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-future-white to-cyan-300 bg-clip-text text-transparent">
                  Obtén tu roadmap personalizado
                </span>
              </h2>
              <p className="mt-4 text-lg text-future-white/80">
                Responde como si hablaras con tu socio. Te devolvemos un plan real y accionable.
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-10">
              <div className="flex justify-between text-sm text-cosmic-light/70 mb-2">
                <span>Paso {currentStep + 1} de {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-electric-purple/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-electric-purple via-neon-purple to-cyan-400 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </motion.div>
              </div>
            </div>
            
            {/* Form Content */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-electric-purple/5 rounded-3xl blur-3xl" />
              <div className="relative bg-void-dark/90 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-cyan-400/20 shadow-[0_0_40px_rgba(103,232,249,0.1)]">
                {!isSubmitted ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="min-h-[400px] flex flex-col"
                    >
                      {/* Question */}
                      <div className="mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-future-white mb-3">
                          {currentQuestion.text}
                        </h3>
                        {currentQuestion.description && (
                          <p className="text-future-white/70 text-lg">
                            {currentQuestion.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Answer Options or Contact Form */}
                      <div className="flex-1">
                        {currentQuestion.type === 'contact-form' ? (
                          <div className="max-w-2xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-future-white/90 mb-2">
                                  Tu nombre completo *
                                </label>
                                <input
                                  type="text"
                                  value={formData.contactInfo.name}
                                  onChange={(e) => handleContactChange('name', e.target.value)}
                                  placeholder="Ej: Juan Pérez"
                                  className="w-full p-4 rounded-xl bg-void-dark/70 border border-cyan-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all text-future-white placeholder:text-future-white/40"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-future-white/90 mb-2">
                                  Nombre de tu empresa *
                                </label>
                                <input
                                  type="text"
                                  value={formData.contactInfo.company}
                                  onChange={(e) => handleContactChange('company', e.target.value)}
                                  placeholder="Ej: Mi Empresa SAS"
                                  className="w-full p-4 rounded-xl bg-void-dark/70 border border-cyan-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all text-future-white placeholder:text-future-white/40"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-future-white/90 mb-2">
                                  Tu correo electrónico *
                                </label>
                                <input
                                  type="email"
                                  value={formData.contactInfo.email}
                                  onChange={(e) => handleContactChange('email', e.target.value)}
                                  placeholder="tu@empresa.com"
                                  className="w-full p-4 rounded-xl bg-void-dark/70 border border-cyan-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all text-future-white placeholder:text-future-white/40"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-future-white/90 mb-2">
                                  WhatsApp (opcional pero recomendado)
                                </label>
                                <input
                                  type="tel"
                                  value={formData.contactInfo.phone}
                                  onChange={(e) => handleContactChange('phone', e.target.value)}
                                  placeholder="+57 312 345 6789"
                                  className="w-full p-4 rounded-xl bg-void-dark/70 border border-cyan-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all text-future-white placeholder:text-future-white/40"
                                />
                                <div className="mt-2 p-3 bg-cyan-400/10 rounded-lg border border-cyan-400/20">
                                  <p className="text-sm text-cyan-400 font-medium mb-1">
                                    🎯 Al dejar tu WhatsApp obtienes:
                                  </p>
                                  <ul className="text-sm text-future-white/80 space-y-1">
                                    <li>• Acceso inmediato a nuestra comunidad de WhatsApp</li>
                                    <li>• Herramientas diarias + cómo usarlas en tu empresa</li>
                                    <li>• Entrada al irrelevant club (red de +30 empresas)</li>
                                  </ul>
                                  <p className="text-xs text-future-white/60 mt-2">
                                    Solo contenido de valor, cero spam ✓
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : currentQuestion.options && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentQuestion.options.map((option) => (
                              <motion.button
                                key={option.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => currentQuestion.type === 'single-select' 
                                  ? handleSingleSelect(option.id) 
                                  : handleMultiSelect(option.id)}
                                className={`relative p-5 rounded-xl border transition-all duration-300 text-left ${
                                  currentQuestion.type === 'single-select' && formData[currentQuestion.id] === option.id
                                    ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(103,232,249,0.2)]'
                                    : currentQuestion.type === 'multi-select' && ((formData[currentQuestion.id] as string[]) || []).includes(option.id)
                                    ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(103,232,249,0.2)]'
                                    : 'border-cyan-400/20 hover:border-cyan-400/40 hover:bg-cyan-400/5'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  {option.icon && (
                                    <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                                      <option.icon className="w-5 h-5 text-cyan-400" />
                                    </div>
                                  )}
                                  <span className="text-future-white text-lg">{option.text}</span>
                                  {((currentQuestion.type === 'single-select' && formData[currentQuestion.id] === option.id) ||
                                    (currentQuestion.type === 'multi-select' && ((formData[currentQuestion.id] as string[]) || []).includes(option.id))) && (
                                    <Check className="absolute right-4 top-4 w-5 h-5 text-cyan-400" />
                                  )}
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Navigation */}
                      <div className="mt-8 flex justify-between items-center">
                        <Button
                          onClick={handleBack}
                          variant="ghost"
                          className={`text-future-white/70 hover:text-future-white ${currentStep === 0 ? 'invisible' : ''}`}
                          disabled={currentStep === 0}
                        >
                          Atrás
                        </Button>
                        
                        {currentStep === questions.length - 1 ? (
                          <Button
                            onClick={handleSubmit}
                            disabled={!canProceed() || isSubmitting}
                            className="bg-gradient-to-r from-electric-purple to-cyan-400 hover:from-electric-purple/90 hover:to-cyan-400/90 text-future-white px-8 py-3 rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(103,232,249,0.3)] disabled:opacity-50 group"
                          >
                            {isSubmitting ? (
                              <>
                                <span className="animate-pulse">Procesando...</span>
                                <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              </>
                            ) : (
                              <>
                                Generar mi roadmap
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </Button>
                        ) : currentQuestion.type === 'multi-select' || currentQuestion.type === 'contact-form' ? (
                          <Button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="bg-cyan-400 hover:bg-cyan-500 text-void-dark px-8 py-3 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(103,232,249,0.3)] disabled:opacity-50 group"
                          >
                            Siguiente
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                    className="text-center py-12"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-electric-purple to-cyan-400 flex items-center justify-center">
                      <Check className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-future-white mb-4">
                      ¡Roadmap generado!
                    </h3>
                    <p className="text-future-white/80 max-w-md mx-auto text-lg">
                      Te enviaremos tu estrategia personalizada a 
                      <span className="text-cyan-400 font-medium"> {formData.contactInfo.email}</span> 
                      <span className="block mt-2">en las próximas 24 horas.</span>
                    </p>
                    <div className="mt-8 text-sm text-future-white/60">
                      Mientras tanto, síguenos en redes para más tips de automatización
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-8 text-center text-sm text-future-white/60">
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