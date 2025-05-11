
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
    icon?: string;
  }[];
}

interface Answer {
  questionId: number;
  optionId: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "¿Cuál es tu principal interés en IA?",
    options: [
      { id: "automation", text: "Automatización de procesos" },
      { id: "data", text: "Análisis de datos" },
      { id: "customer", text: "Experiencia de cliente" },
      { id: "product", text: "Desarrollo de productos" }
    ]
  },
  {
    id: 2,
    text: "¿En qué etapa se encuentra tu empresa?",
    options: [
      { id: "early", text: "Fase inicial" },
      { id: "growth", text: "Crecimiento" },
      { id: "mature", text: "Empresa establecida" },
      { id: "enterprise", text: "Corporación" }
    ]
  },
  {
    id: 3,
    text: "¿Cómo planeas implementar la IA?",
    options: [
      { id: "team", text: "Con equipo interno" },
      { id: "external", text: "Con consultores" },
      { id: "hybrid", text: "Modelo híbrido" },
      { id: "undecided", text: "Aún no lo sé" }
    ]
  }
];

const FormSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  
  const handleOptionSelect = (questionId: number, optionId: string) => {
    const existingAnswerIndex = answers.findIndex(a => a.questionId === questionId);
    const newAnswers = [...answers];
    
    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = { questionId, optionId };
    } else {
      newAnswers.push({ questionId, optionId });
    }
    
    setAnswers(newAnswers);
    
    // Proceed to next question after a short delay
    setTimeout(() => {
      if (currentStep < questions.length) {
        setCurrentStep(currentStep + 1);
      }
    }, 400);
  };
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmailValid) {
      // Simulate API call
      setTimeout(() => {
        setIsSubmitted(true);
        toast.success("¡Formulario enviado con éxito! Te contactaremos pronto.", {
          position: "bottom-right",
        });
      }, 800);
    }
  };
  
  const progress = (currentStep / (questions.length + 1)) * 100;
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (formRef.current) {
      observer.observe(formRef.current);
    }
    
    return () => {
      if (formRef.current) {
        observer.unobserve(formRef.current);
      }
    };
  }, []);
  
  return (
    <section id="form-section" className="py-20 px-4" ref={formRef}>
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className={`transition-all duration-500 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-gradient mb-8 text-center">Comienza tu transformación digital</h2>
            
            {/* Progress indicator */}
            <div className="mb-10 relative">
              <div className="h-2 bg-white/10 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-electric-purple to-neon-purple rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-cosmic-light/70">
                Paso {currentStep + 1} de {questions.length + 1}
              </div>
            </div>
            
            <div className="bg-glass p-8 rounded-2xl shadow-lg">
              {!isSubmitted ? (
                <>
                  {currentStep < questions.length ? (
                    <div className="question-container">
                      <h3 className="mb-6 text-gradient-purple">{questions[currentStep].text}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {questions[currentStep].options.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleOptionSelect(questions[currentStep].id, option.id)}
                            className="glass-card p-6 text-left hover:bg-electric-purple/20 transition-all duration-300"
                          >
                            <span className="text-lg">{option.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="mb-6 text-gradient-purple">¡Último paso! ¿Dónde enviamos tu estrategia personalizada?</h3>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-1 text-cosmic-light/90">
                            Tu correo electrónico
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="tu@email.com"
                            className="w-full p-4 rounded-lg bg-white/5 border border-white/20 focus:border-electric-purple focus:ring-2 focus:ring-electric-purple/30 outline-none transition-all"
                          />
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            disabled={!isEmailValid}
                            className="w-full bg-electric-purple hover:bg-neon-purple text-future-white py-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(112,64,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed group"
                          >
                            Obtener mi estrategia personalizada
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-cosmic-light/60 text-center mt-4">
                          Al enviar este formulario aceptas recibir comunicaciones de irrelevant.
                          Respetamos tu privacidad y nunca compartiremos tus datos.
                        </p>
                      </form>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-gradient-purple mb-4">¡Gracias por tu interés!</h3>
                  <p className="text-future-white/80">
                    Hemos recibido tu solicitud y te enviaremos tu estrategia personalizada
                    a <span className="text-electric-purple font-semibold">{email}</span> en las próximas 24 horas.
                  </p>
                  <p className="mt-6 text-cosmic-light/70">
                    Mientras tanto, revisa tu bandeja de entrada para confirmar tu suscripción.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormSection;
