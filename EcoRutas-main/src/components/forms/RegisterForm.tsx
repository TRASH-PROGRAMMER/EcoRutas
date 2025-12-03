// RegisterForm.tsx
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/InputField";
import { PasswordStrength } from "@/components/PasswordStrength";
import { useToast, ToastContainer } from "@/components/Toast";
import {
  validateNameDetailed,
  validateEmailDetailed,
  validatePasswordDetailed,
  validatePasswordConfirmation,
  getPasswordStrength,
  sanitizeInput,
  debounce,
  validateRegisterForm,
} from "@/utils/validaciones/validaciones";
import { Shield, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface RegisterFormInputs {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: "administrador" | "turista";
}

export default function RegisterForm() {
  const { registerUser: registerUser } = useAuth();
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<RegisterFormInputs>();
  const toast = useToast();
  
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [fieldSuccess, setFieldSuccess] = useState<{ [key: string]: boolean }>({});
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(getPasswordStrength(""));

  // Watch para barra de progreso y fortaleza de contraseña
  const watchedFields = watch();
  const password = watch("password") || "";

  // Actualizar fortaleza de contraseña
  useEffect(() => {
    setPasswordStrength(getPasswordStrength(password));
  }, [password]);

  // Actualizar progreso con validación de calidad
  useEffect(() => {
    let filledFields = 0;
    let validFields = 0;
    
    // Contar campos llenos
    if (watchedFields.nombre?.trim()) filledFields++;
    if (watchedFields.email?.trim()) filledFields++;
    if (watchedFields.password) filledFields++;
    if (watchedFields.confirmPassword) filledFields++;
    if (watchedFields.rol) filledFields++;
    if (acceptedTerms) filledFields++;

    // Contar campos válidos
    if (fieldSuccess.nombre) validFields++;
    if (fieldSuccess.email) validFields++;
    if (fieldSuccess.password && passwordStrength.score >= 3) validFields++;
    if (fieldSuccess.confirmPassword) validFields++;
    if (watchedFields.rol) validFields++;
    if (acceptedTerms) validFields++;

    const progressPercentage = (validFields / 6) * 100;
    setProgress(progressPercentage);
  }, [watchedFields, acceptedTerms, fieldSuccess, passwordStrength]);

  // Validación en tiempo real para nombre
  const validateNameField = useCallback(
    debounce((name: string) => {
      if (!name) return;
      const sanitized = sanitizeInput(name);
      const result = validateNameDetailed(sanitized);
      
      if (!result.isValid) {
        setFieldErrors(prev => ({ ...prev, nombre: result.error! }));
        setFieldSuccess(prev => ({ ...prev, nombre: false }));
      } else {
        setFieldErrors(prev => {
          const { nombre, ...rest } = prev;
          return rest;
        });
        setFieldSuccess(prev => ({ ...prev, nombre: true }));
      }
    }, 500),
    []
  );

  // Validación en tiempo real para email
  const validateEmailField = useCallback(
    debounce((email: string) => {
      if (!email) return;
      const sanitized = sanitizeInput(email);
      const result = validateEmailDetailed(sanitized);
      
      if (!result.isValid) {
        setFieldErrors(prev => ({ ...prev, email: result.error! }));
        setFieldSuccess(prev => ({ ...prev, email: false }));
      } else {
        setFieldErrors(prev => {
          const { email, ...rest } = prev;
          return rest;
        });
        setFieldSuccess(prev => ({ ...prev, email: true }));
      }
    }, 500),
    []
  );

  // Validación en tiempo real para contraseña
  const validatePasswordField = useCallback(
    debounce((pwd: string) => {
      if (!pwd) return;
      const result = validatePasswordDetailed(pwd);
      
      if (!result.isValid) {
        setFieldErrors(prev => ({ ...prev, password: result.error! }));
        setFieldSuccess(prev => ({ ...prev, password: false }));
      } else {
        setFieldErrors(prev => {
          const { password, ...rest } = prev;
          return rest;
        });
        setFieldSuccess(prev => ({ ...prev, password: true }));
      }
    }, 500),
    []
  );

  // Validación en tiempo real para confirmación
  const validateConfirmField = useCallback(
    debounce((confirm: string, pwd: string) => {
      if (!confirm) return;
      const result = validatePasswordConfirmation(pwd, confirm);
      
      if (!result.isValid) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: result.error! }));
        setFieldSuccess(prev => ({ ...prev, confirmPassword: false }));
      } else {
        setFieldErrors(prev => {
          const { confirmPassword, ...rest } = prev;
          return rest;
        });
        setFieldSuccess(prev => ({ ...prev, confirmPassword: true }));
      }
    }, 500),
    []
  );

  const onSubmit = async (data: RegisterFormInputs) => {
    // Validar términos
    if (!acceptedTerms) {
      toast.warning('Términos requeridos', 'Debes aceptar los términos y condiciones');
      return;
    }

    // Validar fortaleza de contraseña
    if (passwordStrength.score < 3) {
      toast.warning('Contraseña débil', 'Usa una contraseña más fuerte (mínimo nivel "Media")');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Sanitizar todos los inputs
      const sanitizedData = {
        nombre: sanitizeInput(data.nombre),
        email: sanitizeInput(data.email.toLowerCase()),
        password: data.password, // NO sanitizar contraseña
        confirmPassword: data.confirmPassword,
        rol: data.rol,
      };

      // Validación completa final
      const validation = validateRegisterForm(sanitizedData);

      if (!validation.valid) {
        // Mostrar errores específicos
        Object.keys(validation.errors).forEach(key => {
          toast.error('Error de validación', validation.errors[key]);
        });
        setFieldErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      // Intentar registro
      const user = await registerUser({
        nombre: sanitizedData.nombre,
        email: sanitizedData.email,
        password: sanitizedData.password,
        rol: sanitizedData.rol
      });

      if (!user) {
        toast.error('Error al registrar', 'El correo ya está registrado o hubo un problema');
      } else {
        toast.success('¡Registro exitoso!', `Bienvenido ${user.nombre}. Tu cuenta ha sido creada.`);
        setMessage(`¡Registro exitoso! Bienvenido ${user.nombre}`);
        
        // Limpiar formulario
        reset();
        setAcceptedTerms(false);
        setProgress(0);
        setFieldErrors({});
        setFieldSuccess({});
      }
    } catch (error) {
      toast.error('Error del servidor', 'Ha ocurrido un error inesperado. Por favor intenta nuevamente.');
      console.error('Error de registro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Registro de Usuario</CardTitle>
            <CardDescription>Completa todos los campos para crear tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Barra de progreso mejorada */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-muted-foreground">Progreso del registro</span>
                <span className="text-xs font-semibold" style={{ color: progress === 100 ? '#22c55e' : '#6b7280' }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: progress === 100 ? '#22c55e' : progress >= 50 ? '#eab308' : '#ef4444'
                  }} 
                />
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Campo Nombre con validación visual */}
              <div className="relative">
                <InputField
                  label="Nombre Completo"
                  name="nombre"
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={watchedFields.nombre || ""}
                  onChange={(value) => {
                    setValue("nombre", value);
                    validateNameField(value);
                  }}
                  error={fieldErrors.nombre}
                  helpText="Mínimo 2 caracteres, solo letras"
                  required
                  autoComplete="name"
                />
                {fieldSuccess.nombre && !fieldErrors.nombre && watchedFields.nombre && (
                  <CheckCircle2 className="absolute right-3 top-9 h-5 w-5 text-green-500" />
                )}
              </div>

              {/* Campo Email con validación visual */}
              <div className="relative">
                <InputField
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={watchedFields.email || ""}
                  onChange={(value) => {
                    setValue("email", value);
                    validateEmailField(value);
                  }}
                  error={fieldErrors.email}
                  helpText="Usaremos este email para comunicarnos contigo"
                  required
                  autoComplete="email"
                />
                {fieldSuccess.email && !fieldErrors.email && watchedFields.email && (
                  <CheckCircle2 className="absolute right-3 top-9 h-5 w-5 text-green-500" />
                )}
              </div>

              {/* Campo Contraseña con fortaleza */}
              <div>
                <InputField
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={watchedFields.password || ""}
                  onChange={(value) => {
                    setValue("password", value);
                    validatePasswordField(value);
                  }}
                  error={fieldErrors.password}
                  helpText="Debe incluir mayúsculas, números y mínimo 8 caracteres"
                  required
                  autoComplete="new-password"
                />
                
                {/* Indicador de fortaleza mejorado */}
                {password && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-muted-foreground">Fortaleza:</span>
                      <span className="text-xs font-semibold" style={{ color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${passwordStrength.percentage}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      />
                    </div>
                    <PasswordStrength password={password} showLabel={false} showRequirements />
                  </div>
                )}
              </div>

              {/* Campo Confirmar Contraseña con validación visual */}
              <div>
                <InputField
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={watchedFields.confirmPassword || ""}
                  onChange={(value) => {
                    setValue("confirmPassword", value);
                    validateConfirmField(value, password);
                  }}
                  error={fieldErrors.confirmPassword}
                  compareValue={password}
                  required
                  autoComplete="new-password"
                />
              </div>

              {/* Campo Rol mejorado */}
              <div>
                <label htmlFor="rol" className="block text-sm font-medium text-foreground mb-1.5">
                  Tipo de Cuenta <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  {...register("rol", { required: "Selecciona un tipo de cuenta" })}
                  className="mt-1 w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  required
                >
                  <option value="">Selecciona un tipo de cuenta</option>
                  <option value="administrador">🏘️ Administrador de Localidad</option>
                  <option value="turista">🎒 Turista / Viajero</option>
                </select>
                {errors.rol && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.rol.message}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-foreground cursor-pointer">
                  Acepto los{' '}
                  <a href="/terminos" target="_blank" className="text-primary-600 hover:text-primary-700 font-medium underline">términos y condiciones</a>
                  {' '}y la{' '}
                  <a href="/privacidad" target="_blank" className="text-primary-600 hover:text-primary-700 font-medium underline">política de privacidad</a>
                </label>
              </div>

              {/* Información de seguridad */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Tu información está protegida y encriptada. Nunca compartiremos tus datos con terceros.
                </p>
              </div>

              {/* Botón de registro */}
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={isSubmitting || progress < 100}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Creando cuenta...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4" />
                    Crear Cuenta Segura
                  </span>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground pt-4">
                ¿Ya tienes cuenta?{' '}
                <a href="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                  Inicia sesión aquí
                </a>
              </p>

              {/* Mensaje de registro exitoso */}
              {message && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-green-800 dark:text-green-200">{message}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Contenedor de notificaciones Toast */}
      <ToastContainer messages={toast.messages} onClose={toast.removeToast} />
    </div>
  );
}
