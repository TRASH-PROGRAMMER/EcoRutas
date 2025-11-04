import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  AlertCircle,
  Info,
  Trash2,
  ArrowLeft,
  Check,
  Save,
  RotateCcw,
  HelpCircle,
  MapPin,
  Building,
  Shield,
  FileText,
  Clock,
  Filter,
  Search,
  Eye,
  EyeOff,
  Zap,
  Target,
  Users,
  Star
} from "lucide-react";
import { validateField, sanitizeInput } from "@/utils/validaciones/validaciones";
import { 
  saveLocalidad, 
  getLocalidadById, 
  LocalidadData as StorageLocalidadData 
} from "@/utils/localidadStorage";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

// Interfaces mejoradas
interface LocalidadData {
  nombre: string;
  pais: string;
  provincia: string;
  ciudad: string;
  tipo: string;
  categoria: string;
  descripcion: string;
  descripcionCorta: string;
  accesibilidad: string;
  ubicacion: string;
  coordenadas: string;
  altitud: string;
  clima: string;
  infraestructura: string;
  serviciosBasicos: string;
  serviciosTuristicos: string;
  capacidadMaxima: string;
  temporadaAlta: string;
  temporadaBaja: string;
  seguridad: string;
  medicinaEmergencia: string;
  comunicaciones: string;
  reportes: string;
  certificaciones: string;
  tarifas: string;
  idiomas: string[];
  contactoEmergencia: string;
  sitioWeb: string;
  redesSociales: string;
}

interface FormStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: (keyof LocalidadData)[];
  isCompleted: boolean;
  hasErrors: boolean;
}

// Datos predefinidos para autocompletado y selección
const PAISES = [
  "Ecuador", "Colombia", "Perú", "Bolivia", "Brasil", "Venezuela", "Chile", "Argentina"
];

const PROVINCIAS_ECUADOR = [
  "Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi", "El Oro", 
  "Esmeraldas", "Galápagos", "Guayas", "Imbabura", "Loja", "Los Ríos", 
  "Manabí", "Morona Santiago", "Napo", "Orellana", "Pastaza", "Pichincha", 
  "Santa Elena", "Santo Domingo", "Sucumbíos", "Tungurahua", "Zamora Chinchipe"
];

const TIPOS_ZONA = [
  { value: "Bosque", label: "🌳 Bosque Tropical", description: "Zonas boscosas con biodiversidad" },
  { value: "Montaña", label: "🏔️ Montaña/Páramo", description: "Elevaciones y ecosistemas de altura" },
  { value: "Playa", label: "🏖️ Costa/Playa", description: "Zonas costeras y playas" },
  { value: "Reserva", label: "🦋 Reserva Natural", description: "Áreas protegidas y conservación" },
  { value: "Rio", label: "🌊 Río/Cascada", description: "Cuerpos de agua y cascadas" },
  { value: "Cultural", label: "🏛️ Sitio Cultural", description: "Patrimonio y cultura local" },
  { value: "Aventura", label: "🎯 Turismo de Aventura", description: "Actividades extremas y deportes" },
  { value: "Agro", label: "🌾 Agroturismo", description: "Experiencias agrícolas y rurales" }
];

const CATEGORIAS = [
  { value: "Premium", label: "⭐ Premium", color: "bg-yellow-100 text-yellow-800" },
  { value: "Estandar", label: "🔹 Estándar", color: "bg-blue-100 text-blue-800" },
  { value: "Basico", label: "🔸 Básico", color: "bg-gray-100 text-gray-800" },
  { value: "Economico", label: "💰 Económico", color: "bg-green-100 text-green-800" }
];

const IDIOMAS_DISPONIBLES = [
  "Español", "Inglés", "Kichwa", "Shuar", "Francés", "Alemán", "Italiano", "Portugués"
];

const CERTIFICACIONES = [
  "ISO 14001", "Rainforest Alliance", "Fair Trade", "Green Key", "IUCN", "UNESCO", "Smart Voyager"
];

// Hook personalizado para manejo de autocompletado
const useAutoComplete = (data: string[], value: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = data.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, data]);

  return { suggestions, showSuggestions, setShowSuggestions };
};

// Componente de ayuda contextual
const ContextualHelp: React.FC<{ content: string; title?: string }> = ({ content, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="ml-1 text-blue-500 hover:text-blue-700 transition-colors"
        aria-label="Ayuda contextual"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-80 p-3 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {title && <h4 className="font-semibold text-sm mb-2 text-blue-800">{title}</h4>}
          <p className="text-xs text-gray-600 leading-relaxed">{content}</p>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

// Componente de campo con autocompletado
const AutocompleteField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}> = ({ label, value, onChange, suggestions, placeholder, required, error, helpText }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
        {helpText && <ContextualHelp content={helpText} />}
      </label>
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        className={error ? "border-red-300 focus:border-red-500" : ""}
        aria-invalid={error ? "true" : "false"}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 text-sm"
              onClick={() => {
                onChange(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      {error && (
        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export default function AddLocalidadForm() {
  const { localidadId } = useParams<{ localidadId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState<StorageLocalidadData | null>(null);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
    watch,
    trigger,
    setValue,
    clearErrors,
    reset,
    getValues
  } = useForm<LocalidadData>({ 
    mode: "onChange",
    defaultValues: {
      idiomas: [],
    }
  });

  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [savedData, setSavedData] = useState<Partial<LocalidadData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  
  // Estados para métricas de rendimiento
  const [startTime] = useState(Date.now());
  const [totalFieldInteractions, setTotalFieldInteractions] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [validationSpeed, setValidationSpeed] = useState(0);

  // Definición de pasos del formulario
  const formSteps: FormStep[] = useMemo(() => [
    {
      id: 1,
      title: "Información Básica",
      description: "Datos generales de identificación",
      icon: <Info className="w-5 h-5" />,
      fields: ["nombre", "pais", "provincia", "ciudad", "tipo", "categoria", "descripcionCorta"],
      isCompleted: false,
      hasErrors: false
    },
    {
      id: 2,
      title: "Ubicación y Geografía", 
      description: "Localización y características geográficas",
      icon: <MapPin className="w-5 h-5" />,
      fields: ["ubicacion", "coordenadas", "altitud", "clima", "accesibilidad"],
      isCompleted: false,
      hasErrors: false
    },
    {
      id: 3,
      title: "Infraestructura y Servicios",
      description: "Facilidades y servicios disponibles",
      icon: <Building className="w-5 h-5" />,
      fields: ["infraestructura", "serviciosBasicos", "serviciosTuristicos", "capacidadMaxima"],
      isCompleted: false,
      hasErrors: false
    },
    {
      id: 4,
      title: "Seguridad y Emergencias",
      description: "Protocolos y medidas de seguridad",
      icon: <Shield className="w-5 h-5" />,
      fields: ["seguridad", "medicinaEmergencia", "comunicaciones", "contactoEmergencia"],
      isCompleted: false,
      hasErrors: false
    },
    {
      id: 5,
      title: "Gestión y Operación",
      description: "Información comercial y operativa",
      icon: <FileText className="w-5 h-5" />,
      fields: ["temporadaAlta", "temporadaBaja", "tarifas", "certificaciones", "idiomas"],
      isCompleted: false,
      hasErrors: false
    },
    {
      id: 6,
      title: "Descripción Completa",
      description: "Descripción detallada y marketing",
      icon: <Star className="w-5 h-5" />,
      fields: ["descripcion", "reportes", "sitioWeb", "redesSociales"],
      isCompleted: false,
      hasErrors: false
    }
  ], []);

  const currentStep = formSteps[step];
  const progress = ((step + 1) / formSteps.length) * 100;

  // Watchers para autocompletado
  const watchedPais = watch("pais");
  const watchedNombre = watch("nombre");
  
  // Autocompletado hooks
  const paisSuggestions = useAutoComplete(PAISES, watchedPais || "");
  const provinciaSuggestions = useAutoComplete(
    watchedPais === "Ecuador" ? PROVINCIAS_ECUADOR : [], 
    watch("provincia") || ""
  );

  // Validación de paso actual con métricas
  const validateCurrentStep = useCallback(async () => {
    const startValidation = Date.now();
    const fieldsToValidate = currentStep.fields;
    const result = await trigger(fieldsToValidate);
    const validationTime = Date.now() - startValidation;
    setValidationSpeed(validationTime);
    
    if (!result) {
      setErrorCount(prev => prev + 1);
    }
    
    return result;
  }, [currentStep.fields, trigger]);

  // Navegación entre pasos
  const handleNext = async () => {
    setIsLoading(true);
    const isStepValid = await validateCurrentStep();
    
    if (isStepValid) {
      // Guardar progreso automáticamente
      const currentData = getValues();
      setSavedData(currentData);
      
      toast({
        title: "Progreso guardado",
        description: "Sus datos han sido guardados automáticamente",
        duration: 2000,
      });

      setStep((prev) => Math.min(prev + 1, formSteps.length - 1));
    } else {
      toast({
        title: "Campos incompletos",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
        duration: 3000,
      });
    }
    setIsLoading(false);
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  // Autoguardado cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const currentData = getValues();
      setSavedData(currentData);
      
      // Guardado silencioso
      localStorage.setItem(`localidad_draft_${localidadId}`, JSON.stringify(currentData));
    }, 30000);

    return () => clearInterval(interval);
  }, [getValues, localidadId]);

  // Cargar datos existentes o borrador
  useEffect(() => {
    const loadData = async () => {
      if (!localidadId) return;
      
      // Primero intentar cargar datos guardados (modo edición)
      const existingData = getLocalidadById(localidadId);
      
      if (existingData) {
        // Modo edición
        setIsEditMode(true);
        setOriginalData(existingData);
        
        // Convertir datos del storage al formato del formulario
        const formData = {
          nombre: existingData.nombre || "",
          pais: existingData.pais || "",
          provincia: existingData.provincia || "", 
          ciudad: existingData.ciudad || "",
          tipo: existingData.tipo || "",
          categoria: existingData.categoria || "",
          descripcion: existingData.descripcion || "",
          descripcionCorta: existingData.descripcionCorta || "",
          accesibilidad: existingData.accesibilidad || "",
          ubicacion: existingData.ubicacion || "",
          coordenadas: existingData.coordenadas || "",
          altitud: existingData.altitud || "",
          clima: existingData.clima || "",
          infraestructura: existingData.infraestructura || "",
          serviciosBasicos: existingData.serviciosBasicos || "",
          serviciosTuristicos: existingData.serviciosTuristicos || "",
          capacidadMaxima: existingData.capacidadMaxima || "",
          temporadaAlta: existingData.temporadaAlta || "",
          temporadaBaja: existingData.temporadaBaja || "",
          seguridad: existingData.seguridad || "",
          medicinaEmergencia: existingData.medicinaEmergencia || "",
          comunicaciones: existingData.comunicaciones || "",
          reportes: existingData.reportes || "",
          certificaciones: existingData.certificaciones || "",
          tarifas: existingData.tarifas || "",
          idiomas: existingData.idiomas || [],
          contactoEmergencia: existingData.contactoEmergencia || "",
          sitioWeb: existingData.sitioWeb || "",
          redesSociales: existingData.redesSociales || "",
        };
        
        reset(formData);
        setSavedData(formData);
        
        toast({
          title: "Datos cargados",
          description: `Editando localidad: ${existingData.nombre}`,
          duration: 3000,
        });
        
        return;
      }
      
      // Si no hay datos guardados, intentar cargar borrador
      const draftKey = `localidad_draft_${localidadId}`;
      const savedDraft = localStorage.getItem(draftKey);
      
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft);
          reset(draftData);
          setSavedData(draftData);
          
          toast({
            title: "Borrador recuperado",
            description: "Se ha cargado su borrador guardado anteriormente",
            duration: 3000,
          });
        } catch (error) {
          console.error("Error loading draft:", error);
        }
      }
    };
    
    loadData();
  }, [localidadId, reset]);

  // Función de envío mejorada
  const onSubmit = async (data: LocalidadData) => {
    if (!localidadId) return;
    
    setIsLoading(true);
    
    try {
      // Sanitización de datos
      const sanitizedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key as keyof LocalidadData] = sanitizeInput(value) as any;
        } else {
          acc[key as keyof LocalidadData] = value;
        }
        return acc;
      }, {} as LocalidadData);

      // Preparar datos para guardar
      const dataToSave = {
        id: localidadId,
        ...sanitizedData,
        createdBy: user?.nombre || 'Admin',
        status: (isEditMode ? originalData?.status || 'draft' : 'draft') as 'draft' | 'published' | 'archived',
      };

      // Guardar en el sistema
      const savedData = saveLocalidad(dataToSave);
      
      console.log("Datos guardados:", savedData);
      
      // Limpiar borrador
      localStorage.removeItem(`localidad_draft_${localidadId}`);
      
      toast({
        title: isEditMode ? "✅ Localidad actualizada" : "✅ Localidad registrada",
        description: isEditMode 
          ? "Los cambios han sido guardados exitosamente" 
          : "La localidad ha sido registrada exitosamente",
        duration: 4000,
      });

      setCompleted(true);
      
    } catch (error) {
      console.error("Error saving localidad:", error);
      toast({
        title: "Error al guardar",
        description: "Ha ocurrido un error. Por favor intente nuevamente",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función de limpieza de formulario
  const handleClearForm = () => {
    if (confirm("¿Está seguro que desea limpiar todos los campos del formulario?")) {
      reset();
      setSavedData(null);
      setStep(0);
      localStorage.removeItem(`localidad_draft_${localidadId}`);
      
      toast({
        title: "Formulario limpiado",
        description: "Todos los campos han sido restablecidos",
        duration: 2000,
      });
    }
  };

  // Función de vista previa
  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  // Feedback visual de campos
  const getFieldStatus = (field: keyof LocalidadData) => {
    const value = watch(field);
    const hasError = errors[field];
    
    if (!value || (typeof value === 'string' && value.trim() === "") || 
        (Array.isArray(value) && value.length === 0)) return null;
    if (hasError) return "error";
    return "success";
  };

  const renderFieldIcon = (field: keyof LocalidadData) => {
    const status = getFieldStatus(field);
    if (status === "success") return <Check className="w-4 h-4 text-green-600" />;
    if (status === "error") return <X className="w-4 h-4 text-red-600" />;
    return null;
  };

  // Manejo de eliminación
  const handleDelete = () => {
    localStorage.removeItem(`localidad_draft_${localidadId}`);
    navigate("/dashboard/admin");
    
    toast({
      title: "Localidad eliminada",
      description: "La localidad ha sido eliminada del sistema",
      variant: "destructive",
      duration: 3000,
    });
  };

  const handleGoBack = () => {
    navigate("/dashboard/admin");
  };

  // Navegación por teclado mejorada
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key) {
          case 'ArrowRight':
            event.preventDefault();
            if (step < formSteps.length - 1) handleNext();
            break;
          case 'ArrowLeft':
            event.preventDefault();
            if (step > 0) handlePrevious();
            break;
          case 's':
            event.preventDefault();
            const currentData = getValues();
            setSavedData(currentData);
            localStorage.setItem(`localidad_draft_${localidadId}`, JSON.stringify(currentData));
            toast({
              title: "Guardado manual",
              description: "Progreso guardado exitosamente",
              duration: 2000,
            });
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, formSteps.length, getValues, localidadId]);

  // Renderizado de estado completado
  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] max-w-2xl mx-auto">
        <div className="text-center space-y-8 p-8">
          <div className="relative">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-green-700">
              ✅ Registro Completado Exitosamente
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              La localidad <strong>{savedData?.nombre}</strong> ha sido registrada correctamente en el sistema EcoRutas.
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>ID: {localidadId}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGoBack}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
            <Button 
              onClick={() => navigate(`/dashboard/admin/localidades/${localidadId}/guias`)}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 px-8 py-3"
              size="lg"
            >
              <Users className="w-4 h-4 mr-2" />
              Gestionar Guías
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-xl border border-emerald-200">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                {currentStep.icon}
              </div>
              <div>
              <h1 className="text-2xl font-bold text-emerald-700">
                {isEditMode ? "Editar Localidad Turística" : "Registro de Localidad Turística"}
              </h1>
              <p className="text-emerald-600 text-sm">
                ID: {localidadId} • Paso {step + 1} de {formSteps.length}
                {isEditMode && originalData && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    Editando: {originalData.nombre}
                  </span>
                )}
              </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Autoguardado activo
              </span>
              {savedData && (
                <span className="flex items-center gap-1 text-green-600">
                  <Check className="w-4 h-4" />
                  Progreso guardado
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              className="flex items-center gap-2"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Ocultar" : "Vista Previa"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClearForm}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
            >
              <RotateCcw className="w-4 h-4" />
              Limpiar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmación de eliminación mejorada */}
      {showDeleteConfirm && (
        <Alert className="border-red-300 bg-red-50">
          <AlertCircle className="w-5 h-5" />
          <AlertDescription>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-red-800 text-lg">
                  ⚠️ Confirmar Eliminación
                </h4>
                <p className="text-red-700 text-sm mt-2">
                  Esta acción eliminará permanentemente la localidad <strong>{watchedNombre || localidadId}</strong> 
                  y todos sus datos asociados. Esta operación no se puede deshacer.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Sí, eliminar permanentemente
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Barra de progreso mejorada */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-800">
                {currentStep.title}
              </h3>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {Math.round(progress)}% Completado
              </Badge>
            </div>
            
            <Progress value={progress} className="h-3 bg-blue-100" />
            
            <div className="flex items-center justify-between text-sm">
              <p className="text-blue-600">{currentStep.description}</p>
              <div className="flex items-center gap-2 text-blue-600">
                <Zap className="w-4 h-4" />
                <span>Ctrl+← / Ctrl+→ para navegar</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navegación de pasos */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {formSteps.map((stepItem, index) => (
              <div 
                key={stepItem.id}
                className={`flex items-center flex-shrink-0 ${
                  index < formSteps.length - 1 ? 'mr-4' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setStep(index)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    index === step 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                      : index < step
                      ? 'bg-green-100 text-green-700 hover:bg-green-150'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-150'
                  }`}
                  disabled={isLoading}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    index === step 
                      ? 'bg-emerald-200 text-emerald-800' 
                      : index < step
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index < step ? <Check className="w-3 h-3" /> : index + 1}
                  </div>
                  <span className="hidden sm:block">{stepItem.title}</span>
                </button>
                
                {index < formSteps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

        {/* PASO 1: Información Básica */}
        {step === 0 && (
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
              <CardTitle className="flex items-center gap-3 text-emerald-700">
                <Info className="w-6 h-6" />
                Información Básica
                <ContextualHelp 
                  title="Información Básica"
                  content="Complete los datos fundamentales de identificación de la localidad turística. Estos datos son esenciales para el registro en el sistema."
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Nombre de la localidad */}
                <div className="lg:col-span-2">
                  <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-3">
                    Nombre de la Localidad *
                    <span className="ml-3">{renderFieldIcon("nombre")}</span>
                    <ContextualHelp content="Ingrese el nombre oficial o comercial de la localidad turística. Este será el nombre principal que aparecerá en todas las publicaciones." />
                  </label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Cascada Verde del Cuyabeno, Reserva Ecológica Mindo..."
                    autoComplete="organization"
                    className={`text-lg font-medium transition-all duration-200 ${
                      getFieldStatus("nombre") === "error" 
                        ? "border-red-300 focus:border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200" 
                        : getFieldStatus("nombre") === "success"
                        ? "border-green-300 focus:border-green-500 bg-green-50 focus:ring-2 focus:ring-green-200"
                        : "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    }`}
                    {...register("nombre", { 
                      required: "El nombre de la localidad es obligatorio",
                      minLength: { value: 3, message: "El nombre debe tener al menos 3 caracteres" },
                      maxLength: { value: 100, message: "El nombre no puede exceder 100 caracteres" },
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-.,()]+$/,
                        message: "El nombre solo puede contener letras, espacios y signos básicos"
                      }
                    })}
                    onChange={(e) => {
                      setTotalFieldInteractions(prev => prev + 1);
                      // Llamar al onChange original del register
                      register("nombre").onChange(e);
                    }}
                    aria-invalid={errors.nombre ? "true" : "false"}
                    aria-describedby={errors.nombre ? "nombre-error" : undefined}
                  />
                  {errors.nombre && (
                    <p id="nombre-error" className="text-red-600 text-sm mt-2 flex items-center gap-2 bg-red-50 p-2 rounded">
                      <AlertCircle className="w-4 h-4" />
                      {errors.nombre.message}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <span>{watch("nombre")?.length || 0}/100 caracteres</span>
                    {watch("nombre")?.length > 80 && <span className="text-orange-500">Acercándose al límite</span>}
                  </div>
                </div>

                {/* País con autocompletado */}
                <AutocompleteField
                  label="País"
                  value={watch("pais") || ""}
                  onChange={(value) => setValue("pais", value, { shouldValidate: true })}
                  suggestions={paisSuggestions.suggestions}
                  placeholder="Seleccione o escriba el país"
                  required
                  error={errors.pais?.message}
                  helpText="Seleccione el país donde se encuentra la localidad. El sistema sugerirá opciones mientras escribe."
                />

                {/* Provincia con autocompletado condicional */}
                <AutocompleteField
                  label="Provincia/Estado"
                  value={watch("provincia") || ""}
                  onChange={(value) => setValue("provincia", value, { shouldValidate: true })}
                  suggestions={provinciaSuggestions.suggestions}
                  placeholder={watchedPais === "Ecuador" ? "Seleccione una provincia" : "Ingrese la provincia/estado"}
                  required
                  error={errors.provincia?.message}
                  helpText="Especifique la provincia, estado o región administrativa donde se ubica la localidad."
                />

                {/* Ciudad */}
                <div>
                  <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad/Cantón *
                    <span className="ml-2">{renderFieldIcon("ciudad")}</span>
                    <ContextualHelp content="Ingrese la ciudad, cantón o municipio más cercano a la localidad turística." />
                  </label>
                  <Input
                    id="ciudad"
                    placeholder="Ej: Baños de Agua Santa, Mindo, Tena..."
                    className={getFieldStatus("ciudad") === "error" ? "border-red-300" : getFieldStatus("ciudad") === "success" ? "border-green-300" : ""}
                    {...register("ciudad", { 
                      required: "La ciudad es obligatoria",
                      minLength: { value: 2, message: "Mínimo 2 caracteres" }
                    })}
                  />
                  {errors.ciudad && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.ciudad.message}
                    </p>
                  )}
                </div>

                {/* Tipo de zona con opciones mejoradas */}
                <div>
                  <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Zona Turística *
                    <span className="ml-2">{renderFieldIcon("tipo")}</span>
                    <ContextualHelp content="Seleccione el tipo de ecosistema o zona turística que mejor describe la localidad." />
                  </label>
                  <Controller
                    name="tipo"
                    control={control}
                    rules={{ required: "Debe seleccionar un tipo de zona" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={getFieldStatus("tipo") === "error" ? "border-red-300" : getFieldStatus("tipo") === "success" ? "border-green-300" : ""}>
                          <SelectValue placeholder="Seleccione el tipo de zona turística" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIPOS_ZONA.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{tipo.label}</span>
                                <span className="text-xs text-gray-500">{tipo.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.tipo && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.tipo.message}
                    </p>
                  )}
                </div>

                {/* Categoría de servicio */}
                <div>
                  <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría de Servicio *
                    <span className="ml-2">{renderFieldIcon("categoria")}</span>
                    <ContextualHelp content="Seleccione la categoría que mejor describe el nivel de servicios y facilidades de la localidad." />
                  </label>
                  <Controller
                    name="categoria"
                    control={control}
                    rules={{ required: "Debe seleccionar una categoría" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={getFieldStatus("categoria") === "error" ? "border-red-300" : getFieldStatus("categoria") === "success" ? "border-green-300" : ""}>
                          <SelectValue placeholder="Seleccione la categoría de servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIAS.map((categoria) => (
                            <SelectItem key={categoria.value} value={categoria.value}>
                              <div className="flex items-center gap-2">
                                <span>{categoria.label}</span>
                                <Badge className={`text-xs ${categoria.color}`}>
                                  {categoria.value}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.categoria && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.categoria.message}
                    </p>
                  )}
                </div>

                {/* Descripción corta */}
                <div className="lg:col-span-2">
                  <label htmlFor="descripcionCorta" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción Corta *
                    <span className="ml-2">{renderFieldIcon("descripcionCorta")}</span>
                    <ContextualHelp content="Escriba una descripción breve y atractiva que capture la esencia de la localidad en pocas palabras. Esta aparecerá en listados y búsquedas." />
                  </label>
                  <Textarea
                    id="descripcionCorta"
                    placeholder="Una descripción concisa y atractiva de la localidad turística que despierte el interés de los visitantes..."
                    rows={3}
                    className={`resize-none ${
                      getFieldStatus("descripcionCorta") === "error" 
                        ? "border-red-300 focus:border-red-500" 
                        : getFieldStatus("descripcionCorta") === "success"
                        ? "border-green-300 focus:border-green-500"
                        : ""
                    }`}
                    {...register("descripcionCorta", { 
                      required: "La descripción corta es obligatoria",
                      minLength: { value: 20, message: "La descripción debe tener al menos 20 caracteres" },
                      maxLength: { value: 200, message: "La descripción no puede exceder 200 caracteres" }
                    })}
                  />
                  {errors.descripcionCorta && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.descripcionCorta.message}
                    </p>
                  )}
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{watch("descripcionCorta")?.length || 0}/200 caracteres</span>
                    {watch("descripcionCorta")?.length > 160 && (
                      <span className="text-orange-500">Acercándose al límite</span>
                    )}
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        )}

        {/* PASO 2: Ubicación y Geografía */}
        {step === 1 && (
          <Card className="border-2 border-blue-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center gap-3 text-blue-700">
                <MapPin className="w-6 h-6" />
                Ubicación y Geografía
                <ContextualHelp 
                  title="Ubicación y Geografía"
                  content="Especifique la ubicación exacta y características geográficas de la localidad para facilitar la navegación y comprensión del entorno."
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Ubicación descriptiva */}
                <div className="lg:col-span-2">
                  <label htmlFor="ubicacion" className="block text-sm font-semibold text-gray-700 mb-3">
                    Descripción de Ubicación *
                    <span className="ml-3">{renderFieldIcon("ubicacion")}</span>
                    <ContextualHelp content="Describa cómo llegar a la localidad, referencias importantes y acceso desde centros poblados cercanos." />
                  </label>
                  <Textarea
                    id="ubicacion"
                    placeholder="Ej: Ubicada a 25 km de Baños por la vía a Puyo, sector Río Verde. Acceso por carretera pavimentada hasta el kilómetro 20, luego camino lastrado en buen estado por 5 km adicionales..."
                    rows={4}
                    className={getFieldStatus("ubicacion") === "error" ? "border-red-300" : getFieldStatus("ubicacion") === "success" ? "border-green-300" : ""}
                    {...register("ubicacion", { 
                      required: "La descripción de ubicación es obligatoria",
                      minLength: { value: 30, message: "Proporcione una descripción más detallada (mínimo 30 caracteres)" },
                      maxLength: { value: 500, message: "La descripción no puede exceder 500 caracteres" }
                    })}
                  />
                  {errors.ubicacion && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.ubicacion.message}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 mt-1">{watch("ubicacion")?.length || 0}/500 caracteres</div>
                </div>

                {/* Coordenadas GPS */}
                <div>
                  <label htmlFor="coordenadas" className="block text-sm font-medium text-gray-700 mb-2">
                    Coordenadas GPS *
                    <span className="ml-2">{renderFieldIcon("coordenadas")}</span>
                    <ContextualHelp content="Ingrese las coordenadas exactas en formato decimal (Ej: -1.2345, -78.6789) o grados minutos segundos." />
                  </label>
                  <Input
                    id="coordenadas"
                    placeholder="Ej: -1.2345, -78.6789"
                    className={getFieldStatus("coordenadas") === "error" ? "border-red-300" : getFieldStatus("coordenadas") === "success" ? "border-green-300" : ""}
                    {...register("coordenadas", { 
                      required: "Las coordenadas GPS son obligatorias",
                      pattern: {
                        value: /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/,
                        message: "Formato inválido. Use: latitud, longitud (Ej: -1.2345, -78.6789)"
                      }
                    })}
                  />
                  {errors.coordenadas && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.coordenadas.message}
                    </p>
                  )}
                </div>

                {/* Altitud */}
                <div>
                  <label htmlFor="altitud" className="block text-sm font-medium text-gray-700 mb-2">
                    Altitud (msnm) *
                    <span className="ml-2">{renderFieldIcon("altitud")}</span>
                    <ContextualHelp content="Especifique la altitud aproximada sobre el nivel del mar en metros. Importante para planificación de actividades." />
                  </label>
                  <Input
                    id="altitud"
                    type="number"
                    min="0"
                    max="6000"
                    placeholder="Ej: 1850"
                    className={getFieldStatus("altitud") === "error" ? "border-red-300" : getFieldStatus("altitud") === "success" ? "border-green-300" : ""}
                    {...register("altitud", { 
                      required: "La altitud es obligatoria",
                      min: { value: 0, message: "La altitud debe ser un valor positivo" },
                      max: { value: 6000, message: "La altitud no puede exceder 6000 msnm" }
                    })}
                  />
                  {errors.altitud && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.altitud.message}
                    </p>
                  )}
                </div>

                {/* Clima */}
                <div>
                  <label htmlFor="clima" className="block text-sm font-medium text-gray-700 mb-2">
                    Clima Predominante *
                    <span className="ml-2">{renderFieldIcon("clima")}</span>
                    <ContextualHelp content="Describa el clima general de la zona y variaciones estacionales importantes para los visitantes." />
                  </label>
                  <Controller
                    name="clima"
                    control={control}
                    rules={{ required: "Debe especificar el clima" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={getFieldStatus("clima") === "error" ? "border-red-300" : getFieldStatus("clima") === "success" ? "border-green-300" : ""}>
                          <SelectValue placeholder="Seleccione el clima predominante" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tropical húmedo">🌴 Tropical húmedo (22-28°C)</SelectItem>
                          <SelectItem value="Subtropical">🌿 Subtropical (18-24°C)</SelectItem>
                          <SelectItem value="Templado">🍃 Templado (14-20°C)</SelectItem>
                          <SelectItem value="Frío de montaña">🏔️ Frío de montaña (8-14°C)</SelectItem>
                          <SelectItem value="Páramo">❄️ Páramo (2-8°C)</SelectItem>
                          <SelectItem value="Costero">🏖️ Costero (24-30°C)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.clima && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.clima.message}
                    </p>
                  )}
                </div>

                {/* Accesibilidad detallada */}
                <div className="lg:col-span-2">
                  <label htmlFor="accesibilidad" className="block text-sm font-medium text-gray-700 mb-2">
                    Accesibilidad y Transporte *
                    <span className="ml-2">{renderFieldIcon("accesibilidad")}</span>
                    <ContextualHelp content="Describa detalladamente las opciones de acceso, estado de vías, transporte público, accesibilidad para personas con movilidad reducida." />
                  </label>
                  <Textarea
                    id="accesibilidad"
                    placeholder="Describa: 1) Acceso vehicular (tipo de vía, estado), 2) Transporte público disponible, 3) Accesibilidad para personas con discapacidad, 4) Dificultad del acceso, 5) Tiempo estimado desde centros poblados..."
                    rows={5}
                    className={getFieldStatus("accesibilidad") === "error" ? "border-red-300" : getFieldStatus("accesibilidad") === "success" ? "border-green-300" : ""}
                    {...register("accesibilidad", { 
                      required: "La información de accesibilidad es obligatoria",
                      minLength: { value: 50, message: "Proporcione información más detallada (mínimo 50 caracteres)" }
                    })}
                  />
                  {errors.accesibilidad && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.accesibilidad.message}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 mt-1">{watch("accesibilidad")?.length || 0} caracteres</div>
                </div>

              </div>
            </CardContent>
          </Card>
        )}

        {/* PASO 3: Infraestructura y Servicios */}
        {step === 2 && (
          <Card className="border-2 border-purple-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-3 text-purple-700">
                <Building className="w-6 h-6" />
                Infraestructura y Servicios
                <ContextualHelp 
                  title="Infraestructura y Servicios"
                  content="Detalle todas las facilidades, servicios básicos y turísticos disponibles en la localidad para informar adecuadamente a los visitantes."
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Servicios básicos */}
                <div>
                  <label htmlFor="serviciosBasicos" className="block text-sm font-medium text-gray-700 mb-2">
                    Servicios Básicos *
                    <span className="ml-2">{renderFieldIcon("serviciosBasicos")}</span>
                    <ContextualHelp content="Especifique la disponibilidad de agua potable, electricidad, internet, señal celular, baños públicos, etc." />
                  </label>
                  <Textarea
                    id="serviciosBasicos"
                    placeholder="Ej: Agua potable disponible, electricidad 24h, internet WiFi en centro de visitantes, señal celular regular (Claro/Movistar), baños públicos limpios, área de primeros auxilios..."
                    rows={4}
                    className={getFieldStatus("serviciosBasicos") === "error" ? "border-red-300" : getFieldStatus("serviciosBasicos") === "success" ? "border-green-300" : ""}
                    {...register("serviciosBasicos", { 
                      required: "Los servicios básicos son obligatorios",
                      minLength: { value: 30, message: "Proporcione más detalles (mínimo 30 caracteres)" }
                    })}
                  />
                  {errors.serviciosBasicos && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.serviciosBasicos.message}
                    </p>
                  )}
                </div>

                {/* Servicios turísticos */}
                <div>
                  <label htmlFor="serviciosTuristicos" className="block text-sm font-medium text-gray-700 mb-2">
                    Servicios Turísticos *
                    <span className="ml-2">{renderFieldIcon("serviciosTuristicos")}</span>
                    <ContextualHelp content="Detalle los servicios específicos para turistas: guías, restaurantes, alojamiento, tiendas, actividades, etc." />
                  </label>
                  <Textarea
                    id="serviciosTuristicos"
                    placeholder="Ej: Guías nativos especializados, restaurante con comida típica, tienda de artesanías locales, alquiler de equipos, senderos señalizados, mirador panorámico..."
                    rows={4}
                    className={getFieldStatus("serviciosTuristicos") === "error" ? "border-red-300" : getFieldStatus("serviciosTuristicos") === "success" ? "border-green-300" : ""}
                    {...register("serviciosTuristicos", { 
                      required: "Los servicios turísticos son obligatorios",
                      minLength: { value: 30, message: "Proporcione más detalles (mínimo 30 caracteres)" }
                    })}
                  />
                  {errors.serviciosTuristicos && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.serviciosTuristicos.message}
                    </p>
                  )}
                </div>

                {/* Infraestructura general */}
                <div className="lg:col-span-2">
                  <label htmlFor="infraestructura" className="block text-sm font-medium text-gray-700 mb-2">
                    Infraestructura General *
                    <span className="ml-2">{renderFieldIcon("infraestructura")}</span>
                    <ContextualHelp content="Describa la infraestructura física: senderos, puentes, miradores, centros de interpretación, estacionamientos, etc." />
                  </label>
                  <Textarea
                    id="infraestructura"
                    placeholder="Describa: senderos y su estado, puentes o pasos especiales, miradores construidos, centro de interpretación o información, área de estacionamiento, construcciones principales, facilidades para camping..."
                    rows={4}
                    className={getFieldStatus("infraestructura") === "error" ? "border-red-300" : getFieldStatus("infraestructura") === "success" ? "border-green-300" : ""}
                    {...register("infraestructura", { 
                      required: "La descripción de infraestructura es obligatoria",
                      minLength: { value: 30, message: "Proporcione más detalles (mínimo 30 caracteres)" }
                    })}
                  />
                  {errors.infraestructura && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.infraestructura.message}
                    </p>
                  )}
                </div>

                {/* Capacidad máxima */}
                <div>
                  <label htmlFor="capacidadMaxima" className="block text-sm font-medium text-gray-700 mb-2">
                    Capacidad Máxima de Visitantes *
                    <span className="ml-2">{renderFieldIcon("capacidadMaxima")}</span>
                    <ContextualHelp content="Especifique el número máximo recomendado de visitantes simultáneos para preservar el sitio y garantizar una buena experiencia." />
                  </label>
                  <Input
                    id="capacidadMaxima"
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="Ej: 50"
                    className={getFieldStatus("capacidadMaxima") === "error" ? "border-red-300" : getFieldStatus("capacidadMaxima") === "success" ? "border-green-300" : ""}
                    {...register("capacidadMaxima", { 
                      required: "La capacidad máxima es obligatoria",
                      min: { value: 1, message: "Debe permitir al menos 1 visitante" },
                      max: { value: 1000, message: "La capacidad no puede exceder 1000 visitantes" }
                    })}
                  />
                  {errors.capacidadMaxima && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.capacidadMaxima.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Visitantes simultáneos recomendados</p>
                </div>

                {/* Temporadas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Temporadas Turísticas
                    <ContextualHelp content="Especifique los períodos de mayor y menor afluencia turística para ayudar en la planificación de visitas." />
                  </label>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="temporadaAlta" className="block text-xs font-medium text-gray-600 mb-1">
                        Temporada Alta *
                        <span className="ml-2">{renderFieldIcon("temporadaAlta")}</span>
                      </label>
                      <Input
                        id="temporadaAlta"
                        placeholder="Ej: Junio - Agosto, Diciembre - Enero"
                        className={getFieldStatus("temporadaAlta") === "error" ? "border-red-300" : getFieldStatus("temporadaAlta") === "success" ? "border-green-300" : ""}
                        {...register("temporadaAlta", { 
                          required: "La temporada alta es obligatoria"
                        })}
                      />
                      {errors.temporadaAlta && (
                        <p className="text-red-600 text-xs mt-1">{errors.temporadaAlta.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="temporadaBaja" className="block text-xs font-medium text-gray-600 mb-1">
                        Temporada Baja *
                        <span className="ml-2">{renderFieldIcon("temporadaBaja")}</span>
                      </label>
                      <Input
                        id="temporadaBaja"
                        placeholder="Ej: Marzo - Mayo, Septiembre - Noviembre"
                        className={getFieldStatus("temporadaBaja") === "error" ? "border-red-300" : getFieldStatus("temporadaBaja") === "success" ? "border-green-300" : ""}
                        {...register("temporadaBaja", { 
                          required: "La temporada baja es obligatoria"
                        })}
                      />
                      {errors.temporadaBaja && (
                        <p className="text-red-600 text-xs mt-1">{errors.temporadaBaja.message}</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        )}

        {/* PASO 4: Seguridad y Emergencias */}
        {step === 3 && (
          <Card className="border-2 border-red-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
              <CardTitle className="flex items-center gap-3 text-red-700">
                <Shield className="w-6 h-6" />
                Seguridad y Emergencias
                <ContextualHelp 
                  title="Seguridad y Emergencias"
                  content="Especifique todas las medidas de seguridad, protocolos de emergencia y recursos disponibles para garantizar la seguridad de los visitantes."
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Medidas de seguridad */}
                <div className="lg:col-span-2">
                  <label htmlFor="seguridad" className="block text-sm font-semibold text-gray-700 mb-3">
                    Medidas de Seguridad *
                    <span className="ml-3">{renderFieldIcon("seguridad")}</span>
                    <ContextualHelp content="Describa todas las medidas implementadas para la seguridad de visitantes: controles de acceso, personal de seguridad, señalización, etc." />
                  </label>
                  <Textarea
                    id="seguridad"
                    placeholder="Describa: 1) Control de acceso y registro de visitantes, 2) Personal de seguridad o guardianía, 3) Señalización de riesgos y precauciones, 4) Equipos de seguridad disponibles, 5) Protocolos establecidos, 6) Zonas restringidas o peligrosas..."
                    rows={5}
                    className={getFieldStatus("seguridad") === "error" ? "border-red-300" : getFieldStatus("seguridad") === "success" ? "border-green-300" : ""}
                    {...register("seguridad", { 
                      required: "Las medidas de seguridad son obligatorias",
                      minLength: { value: 50, message: "Proporcione información detallada (mínimo 50 caracteres)" }
                    })}
                  />
                  {errors.seguridad && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.seguridad.message}
                    </p>
                  )}
                </div>

                {/* Medicina de emergencia */}
                <div>
                  <label htmlFor="medicinaEmergencia" className="block text-sm font-medium text-gray-700 mb-2">
                    Servicios Médicos de Emergencia *
                    <span className="ml-2">{renderFieldIcon("medicinaEmergencia")}</span>
                    <ContextualHelp content="Especifique los recursos médicos disponibles: botiquín, personal capacitado, acceso a centros de salud, helicopuerto, etc." />
                  </label>
                  <Textarea
                    id="medicinaEmergencia"
                    placeholder="Ej: Botiquín de primeros auxilios completo, guía certificado en primeros auxilios, radio de emergencia, evacuación por helicóptero disponible, centro de salud a 30 min..."
                    rows={4}
                    className={getFieldStatus("medicinaEmergencia") === "error" ? "border-red-300" : getFieldStatus("medicinaEmergencia") === "success" ? "border-green-300" : ""}
                    {...register("medicinaEmergencia", { 
                      required: "Los servicios médicos de emergencia son obligatorios",
                      minLength: { value: 20, message: "Proporcione más detalles (mínimo 20 caracteres)" }
                    })}
                  />
                  {errors.medicinaEmergencia && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.medicinaEmergencia.message}
                    </p>
                  )}
                </div>

                {/* Comunicaciones */}
                <div>
                  <label htmlFor="comunicaciones" className="block text-sm font-medium text-gray-700 mb-2">
                    Sistemas de Comunicación *
                    <span className="ml-2">{renderFieldIcon("comunicaciones")}</span>
                    <ContextualHelp content="Detalle los medios de comunicación disponibles para emergencias: radio, teléfono satelital, señal celular, etc." />
                  </label>
                  <Textarea
                    id="comunicaciones"
                    placeholder="Ej: Radio VHF para comunicación con base, teléfono satelital disponible, señal celular irregular (solo Claro), punto de comunicación cada 2 km en sendero principal..."
                    rows={4}
                    className={getFieldStatus("comunicaciones") === "error" ? "border-red-300" : getFieldStatus("comunicaciones") === "success" ? "border-green-300" : ""}
                    {...register("comunicaciones", { 
                      required: "Los sistemas de comunicación son obligatorios",
                      minLength: { value: 20, message: "Proporcione más detalles (mínimo 20 caracteres)" }
                    })}
                  />
                  {errors.comunicaciones && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.comunicaciones.message}
                    </p>
                  )}
                </div>

                {/* Contacto de emergencia */}
                <div className="lg:col-span-2">
                  <label htmlFor="contactoEmergencia" className="block text-sm font-medium text-gray-700 mb-2">
                    Contactos de Emergencia *
                    <span className="ml-2">{renderFieldIcon("contactoEmergencia")}</span>
                    <ContextualHelp content="Proporcione todos los contactos importantes para emergencias: números telefónicos, nombres de responsables, horarios de atención." />
                  </label>
                  <Textarea
                    id="contactoEmergencia"
                    placeholder="Incluya: 1) Responsable de seguridad (nombre y teléfono), 2) Centro de salud más cercano, 3) Policía/ECU911, 4) Coordinador local de emergencias, 5) Horarios de disponibilidad..."
                    rows={4}
                    className={getFieldStatus("contactoEmergencia") === "error" ? "border-red-300" : getFieldStatus("contactoEmergencia") === "success" ? "border-green-300" : ""}
                    {...register("contactoEmergencia", { 
                      required: "Los contactos de emergencia son obligatorios",
                      minLength: { value: 30, message: "Proporcione información completa de contactos (mínimo 30 caracteres)" }
                    })}
                  />
                  {errors.contactoEmergencia && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.contactoEmergencia.message}
                    </p>
                  )}
                </div>

              </div>
            </CardContent>
          </Card>
        )}

        {/* PASO 5: Gestión y Operación */}
        {step === 4 && (
          <Card className="border-2 border-green-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-3 text-green-700">
                <FileText className="w-6 h-6" />
                Gestión y Operación
                <ContextualHelp 
                  title="Gestión y Operación"
                  content="Configure los aspectos comerciales y operativos de la localidad: tarifas, certificaciones, idiomas, y políticas de operación."
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Tarifas */}
                <div>
                  <label htmlFor="tarifas" className="block text-sm font-medium text-gray-700 mb-2">
                    Estructura de Tarifas *
                    <span className="ml-2">{renderFieldIcon("tarifas")}</span>
                    <ContextualHelp content="Especifique los precios para diferentes tipos de visitantes y servicios ofrecidos." />
                  </label>
                  <Textarea
                    id="tarifas"
                    placeholder="Ej: Adultos: $15, Niños (5-12): $8, Estudiantes: $10, Tercera edad: $12, Guía especializado: +$25, Almuerzo típico: $12, Transporte desde pueblo: $5..."
                    rows={4}
                    className={getFieldStatus("tarifas") === "error" ? "border-red-300" : getFieldStatus("tarifas") === "success" ? "border-green-300" : ""}
                    {...register("tarifas", { 
                      required: "La estructura de tarifas es obligatoria",
                      minLength: { value: 20, message: "Proporcione detalles de precios (mínimo 20 caracteres)" }
                    })}
                  />
                  {errors.tarifas && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.tarifas.message}
                    </p>
                  )}
                </div>

                {/* Certificaciones */}
                <div>
                  <label htmlFor="certificaciones" className="block text-sm font-medium text-gray-700 mb-2">
                    Certificaciones y Reconocimientos
                    <span className="ml-2">{renderFieldIcon("certificaciones")}</span>
                    <ContextualHelp content="Liste las certificaciones de sostenibilidad, calidad turística, reconocimientos ambientales, etc." />
                  </label>
                  <div className="space-y-3">
                    <Controller
                      name="certificaciones"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione certificaciones (opcional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {CERTIFICACIONES.map((cert) => (
                              <SelectItem key={cert} value={cert}>
                                {cert}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Textarea
                      placeholder="Describa otras certificaciones, reconocimientos o membresías no listadas..."
                      rows={2}
                      className="text-sm"
                      {...register("certificaciones")}
                    />
                  </div>
                </div>

                {/* Idiomas disponibles */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Idiomas Disponibles para Guiado *
                    <span className="ml-2">{renderFieldIcon("idiomas")}</span>
                    <ContextualHelp content="Seleccione todos los idiomas en los que se puede ofrecer servicio de guiado en la localidad." />
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {IDIOMAS_DISPONIBLES.map((idioma) => (
                      <label key={idioma} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          value={idioma}
                          {...register("idiomas", { required: "Debe seleccionar al menos un idioma" })}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-medium text-gray-700">{idioma}</span>
                      </label>
                    ))}
                  </div>
                  {errors.idiomas && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.idiomas.message}
                    </p>
                  )}
                </div>

                {/* Sitio web */}
                <div>
                  <label htmlFor="sitioWeb" className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio Web (opcional)
                    <span className="ml-2">{renderFieldIcon("sitioWeb")}</span>
                    <ContextualHelp content="Ingrese la URL del sitio web oficial de la localidad si existe." />
                  </label>
                  <Input
                    id="sitioWeb"
                    type="url"
                    placeholder="https://www.ejemplo.com"
                    className={getFieldStatus("sitioWeb") === "error" ? "border-red-300" : getFieldStatus("sitioWeb") === "success" ? "border-green-300" : ""}
                    {...register("sitioWeb", {
                      pattern: {
                        value: /^https?:\/\/[^\s$.?#].[^\s]*$/,
                        message: "Ingrese una URL válida (debe comenzar con http:// o https://)"
                      }
                    })}
                  />
                  {errors.sitioWeb && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.sitioWeb.message}
                    </p>
                  )}
                </div>

                {/* Redes sociales */}
                <div>
                  <label htmlFor="redesSociales" className="block text-sm font-medium text-gray-700 mb-2">
                    Redes Sociales (opcional)
                    <span className="ml-2">{renderFieldIcon("redesSociales")}</span>
                    <ContextualHelp content="Enlaces a redes sociales oficiales de la localidad (Facebook, Instagram, etc.)" />
                  </label>
                  <Textarea
                    id="redesSociales"
                    placeholder="Ej: Facebook: @EcoLocalidad, Instagram: @eco_localidad, YouTube: Canal EcoTurismo..."
                    rows={3}
                    {...register("redesSociales")}
                  />
                </div>

              </div>
            </CardContent>
          </Card>
        )}

        {/* PASO 6: Descripción Completa */}
        {step === 5 && (
          <Card className="border-2 border-indigo-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
              <CardTitle className="flex items-center gap-3 text-indigo-700">
                <Star className="w-6 h-6" />
                Descripción Completa y Marketing
                <ContextualHelp 
                  title="Descripción Completa"
                  content="Redacte una descripción detallada y atractiva que sirva para promoción turística y configure los reportes operativos."
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">

                {/* Descripción completa */}
                <div>
                  <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-3">
                    Descripción Completa para Marketing *
                    <span className="ml-3">{renderFieldIcon("descripcion")}</span>
                    <ContextualHelp content="Redacte una descripción detallada y atractiva que capture la esencia única de la localidad, sus atractivos principales, experiencias que ofrece y qué la hace especial." />
                  </label>
                  <Textarea
                    id="descripcion"
                    placeholder="Escriba una descripción completa y atractiva que incluya: 1) La experiencia única que ofrece la localidad, 2) Atractivos naturales y culturales principales, 3) Actividades disponibles, 4) Qué hace especial este lugar, 5) Beneficios para la comunidad local, 6) Historias o leyendas locales relevantes..."
                    rows={8}
                    className={`resize-none ${
                      getFieldStatus("descripcion") === "error" 
                        ? "border-red-300 focus:border-red-500" 
                        : getFieldStatus("descripcion") === "success"
                        ? "border-green-300 focus:border-green-500"
                        : ""
                    }`}
                    {...register("descripcion", { 
                      required: "La descripción completa es obligatoria",
                      minLength: { value: 100, message: "La descripción debe ser más detallada (mínimo 100 caracteres)" },
                      maxLength: { value: 2000, message: "La descripción no puede exceder 2000 caracteres" }
                    })}
                  />
                  {errors.descripcion && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.descripcion.message}
                    </p>
                  )}
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{watch("descripcion")?.length || 0}/2000 caracteres</span>
                    <div className="flex items-center gap-4">
                      {watch("descripcion")?.length > 1800 && (
                        <span className="text-orange-500">Acercándose al límite</span>
                      )}
                      {watch("descripcion") && watch("descripcion").length >= 100 && (
                        <span className="text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Longitud adecuada
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reportes y seguimiento */}
                <div>
                  <label htmlFor="reportes" className="block text-sm font-medium text-gray-700 mb-2">
                    Sistema de Reportes y Monitoreo *
                    <span className="ml-2">{renderFieldIcon("reportes")}</span>
                    <ContextualHelp content="Describa cómo se realizará el seguimiento de visitantes, impacto ambiental, satisfacción y control de calidad." />
                  </label>
                  <Textarea
                    id="reportes"
                    placeholder="Especifique: 1) Método de registro de visitantes, 2) Reportes de impacto ambiental, 3) Encuestas de satisfacción, 4) Monitoreo de fauna y flora, 5) Informes periódicos a autoridades, 6) Indicadores de sostenibilidad que se medirán..."
                    rows={5}
                    className={getFieldStatus("reportes") === "error" ? "border-red-300" : getFieldStatus("reportes") === "success" ? "border-green-300" : ""}
                    {...register("reportes", { 
                      required: "El sistema de reportes es obligatorio",
                      minLength: { value: 50, message: "Proporcione más detalles sobre el sistema de reportes (mínimo 50 caracteres)" }
                    })}
                  />
                  {errors.reportes && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.reportes.message}
                    </p>
                  )}
                </div>

                {/* Resumen final */}
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-700">
                      🎯 Resumen del Registro
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700">Información Básica</h4>
                        <div><strong>Nombre:</strong> {watch("nombre") || "Por definir"}</div>
                        <div><strong>Ubicación:</strong> {watch("ciudad")}, {watch("provincia")}</div>
                        <div><strong>Tipo:</strong> {watch("tipo") || "Por definir"}</div>
                        <div><strong>Categoría:</strong> {watch("categoria") || "Por definir"}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700">Detalles Técnicos</h4>
                        <div><strong>Coordenadas:</strong> {watch("coordenadas") || "Por definir"}</div>
                        <div><strong>Altitud:</strong> {watch("altitud") ? `${watch("altitud")} msnm` : "Por definir"}</div>
                        <div><strong>Clima:</strong> {watch("clima") || "Por definir"}</div>
                        <div><strong>Capacidad:</strong> {watch("capacidadMaxima") ? `${watch("capacidadMaxima")} visitantes` : "Por definir"}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700">Servicios</h4>
                        <div><strong>Idiomas:</strong> {watch("idiomas")?.length ? `${watch("idiomas").length} idiomas` : "Por definir"}</div>
                        <div><strong>Temporada Alta:</strong> {watch("temporadaAlta") || "Por definir"}</div>
                        <div><strong>Certificaciones:</strong> {watch("certificaciones") || "Ninguna"}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </CardContent>
          </Card>
        )}

        {/* Vista previa dinámica mejorada */}
        {showPreview && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-blue-700">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Vista Previa - {watch("nombre") || "Nueva Localidad"}
                </div>
                
                {/* Filtros dinámicos */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue placeholder="Filtrar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="basico">Básico</SelectItem>
                        <SelectItem value="ubicacion">Ubicación</SelectItem>
                        <SelectItem value="servicios">Servicios</SelectItem>
                        <SelectItem value="seguridad">Seguridad</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="relative">
                    <Search className="w-3 h-3 absolute left-2 top-2 text-gray-400" />
                    <Input
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-32 h-8 pl-7 text-xs"
                    />
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                
                {/* Información Básica */}
                {(!filterCategory || filterCategory === "basico") && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-emerald-600" />
                      Información Básica
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div><strong>Nombre:</strong> {watch("nombre") || "Por completar"}</div>
                      <div><strong>País:</strong> {watch("pais") || "Por completar"}</div>
                      <div><strong>Provincia:</strong> {watch("provincia") || "Por completar"}</div>
                      <div><strong>Ciudad:</strong> {watch("ciudad") || "Por completar"}</div>
                      <div><strong>Tipo:</strong> {watch("tipo") || "Por completar"}</div>
                      <div className="flex items-center gap-2">
                        <strong>Categoría:</strong> 
                        {watch("categoria") ? (
                          <Badge className={CATEGORIAS.find(c => c.value === watch("categoria"))?.color || "bg-gray-100"}>
                            {watch("categoria")}
                          </Badge>
                        ) : "Por completar"}
                      </div>
                    </div>
                    {watch("descripcionCorta") && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <strong className="text-sm">Descripción:</strong>
                        <p className="text-sm text-gray-700 mt-1">{watch("descripcionCorta")}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Ubicación y Geografía */}
                {(!filterCategory || filterCategory === "ubicacion") && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Ubicación y Geografía
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div><strong>Coordenadas:</strong> {watch("coordenadas") || "Por completar"}</div>
                      <div><strong>Altitud:</strong> {watch("altitud") ? `${watch("altitud")} msnm` : "Por completar"}</div>
                      <div><strong>Clima:</strong> {watch("clima") || "Por completar"}</div>
                    </div>
                    {watch("ubicacion") && (
                      <div className="mt-3 p-3 bg-blue-50 rounded">
                        <strong className="text-sm">Cómo llegar:</strong>
                        <p className="text-sm text-gray-700 mt-1">{watch("ubicacion")}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Servicios e Infraestructura */}
                {(!filterCategory || filterCategory === "servicios") && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Building className="w-4 h-4 text-purple-600" />
                      Servicios e Infraestructura
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div><strong>Capacidad máxima:</strong> {watch("capacidadMaxima") ? `${watch("capacidadMaxima")} visitantes` : "Por completar"}</div>
                      <div><strong>Temporada alta:</strong> {watch("temporadaAlta") || "Por completar"}</div>
                      <div><strong>Temporada baja:</strong> {watch("temporadaBaja") || "Por completar"}</div>
                      <div><strong>Idiomas disponibles:</strong> {watch("idiomas")?.length ? `${watch("idiomas").length} idiomas` : "Por completar"}</div>
                    </div>
                    {watch("serviciosBasicos") && (
                      <div className="mt-3 p-3 bg-purple-50 rounded">
                        <strong className="text-sm">Servicios básicos:</strong>
                        <p className="text-sm text-gray-700 mt-1">{watch("serviciosBasicos")}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Seguridad */}
                {(!filterCategory || filterCategory === "seguridad") && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-600" />
                      Seguridad y Emergencias
                    </h4>
                    <div className="space-y-2 text-sm">
                      {watch("seguridad") && (
                        <div className="p-3 bg-red-50 rounded">
                          <strong>Medidas de seguridad:</strong>
                          <p className="text-gray-700 mt-1">{watch("seguridad").substring(0, 100)}{watch("seguridad").length > 100 ? "..." : ""}</p>
                        </div>
                      )}
                      {watch("contactoEmergencia") && (
                        <div className="p-3 bg-orange-50 rounded">
                          <strong>Contactos de emergencia:</strong>
                          <p className="text-gray-700 mt-1">{watch("contactoEmergencia").substring(0, 100)}{watch("contactoEmergencia").length > 100 ? "..." : ""}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Información Comercial */}
                {(!filterCategory || filterCategory === "comercial") && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      Información Comercial
                    </h4>
                    <div className="space-y-2 text-sm">
                      {watch("tarifas") && (
                        <div className="p-3 bg-green-50 rounded">
                          <strong>Tarifas:</strong>
                          <p className="text-gray-700 mt-1">{watch("tarifas")}</p>
                        </div>
                      )}
                      {watch("certificaciones") && (
                        <div><strong>Certificaciones:</strong> {watch("certificaciones")}</div>
                      )}
                      {watch("sitioWeb") && (
                        <div><strong>Sitio web:</strong> <a href={watch("sitioWeb")} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{watch("sitioWeb")}</a></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Estadísticas de completitud */}
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Progreso del Registro
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        {Object.values(watch()).filter(value => 
                          value && (typeof value === 'string' ? value.trim() !== '' : 
                          Array.isArray(value) ? value.length > 0 : true)
                        ).length}
                      </div>
                      <div className="text-xs text-gray-600">Campos completados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{step + 1}</div>
                      <div className="text-xs text-gray-600">Paso actual</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(progress)}%
                      </div>
                      <div className="text-xs text-gray-600">Progreso total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {Object.keys(errors).length}
                      </div>
                      <div className="text-xs text-gray-600">Errores pendientes</div>
                    </div>
                  </div>
                  
                  {/* Métricas de rendimiento */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600 mt-4 pt-4 border-t border-emerald-200">
                    <div className="text-center">
                      <div className="font-semibold text-gray-800">
                        {Math.round((Date.now() - startTime) / 1000 / 60)}min
                      </div>
                      <div>Tiempo en formulario</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-800">
                        {totalFieldInteractions}
                      </div>
                      <div>Interacciones</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-800">
                        {validationSpeed}ms
                      </div>
                      <div>Validación (última)</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-800">
                        {errorCount}
                      </div>
                      <div>Total errores</div>
                    </div>
                  </div>
                </div>

                {/* Descripción completa si está disponible */}
                {watch("descripcion") && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-600" />
                      Descripción para Marketing
                    </h4>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {watch("descripcion")}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        {watch("descripcion").length} caracteres • 
                        {Math.ceil(watch("descripcion").split(' ').length / 200)} min de lectura aprox.
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </CardContent>
          </Card>
        )}

        {/* Navegación mejorada */}
        <Card className="bg-gray-50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                {step > 0 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handlePrevious} 
                    className="flex items-center gap-2"
                    disabled={isLoading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>
                )}
                
                <div className="text-sm text-gray-600">
                  Paso {step + 1} de {formSteps.length}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Botón de guardado manual */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentData = getValues();
                    setSavedData(currentData);
                    localStorage.setItem(`localidad_draft_${localidadId}`, JSON.stringify(currentData));
                    toast({
                      title: "Progreso guardado",
                      description: "Sus datos han sido guardados exitosamente",
                      duration: 2000,
                    });
                  }}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4" />
                  Guardar Progreso
                </Button>

                {step < formSteps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 px-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Validando...
                      </>
                    ) : (
                      <>
                        Siguiente
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                  ) : (
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-8"
                    disabled={!isValid || isLoading || isSubmitting}
                  >
                    {isLoading || isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {isEditMode ? "Actualizando..." : "Registrando..."}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        {isEditMode ? "Guardar Cambios" : "Completar Registro"}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Atajos de teclado */}
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl</kbd> + 
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">←</kbd> 
                Paso anterior
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl</kbd> + 
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">→</kbd> 
                Siguiente paso
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl</kbd> + 
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">S</kbd> 
                Guardar progreso
              </span>
            </div>
          </CardContent>
        </Card>

      </form>
    </div>
  );
}