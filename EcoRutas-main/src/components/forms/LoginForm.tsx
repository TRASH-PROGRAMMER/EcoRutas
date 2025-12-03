// LoginForm.tsx
import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { InputField } from "../InputField";
import { Button } from "@/components/ui/button";
import { useToast, ToastContainer } from "@/components/Toast";
import { 
  validateEmailDetailed, 
  validatePasswordDetailed,
  sanitizeInput,
  debounce 
} from "@/utils/validaciones/validaciones";
import { AlertTriangle, Shield } from "lucide-react";

interface LoginFormInputs {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginAttempt {
  timestamp: number;
  email: string;
}

// Constantes de seguridad
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos
const ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minutos

export default function LoginForm() {
  const { login } = useAuth();
  const { control, handleSubmit, reset, formState: { errors }, setError, clearErrors } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    mode: "onChange", // Validación en tiempo real
  });

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [securityWarning, setSecurityWarning] = useState("");

  // Verificar si el usuario está bloqueado por intentos fallidos
  const checkLockout = useCallback(() => {
    const now = Date.now();
    const recentAttempts = loginAttempts.filter(
      attempt => now - attempt.timestamp < LOCKOUT_DURATION
    );

    if (recentAttempts.length >= MAX_LOGIN_ATTEMPTS) {
      const oldestAttempt = Math.min(...recentAttempts.map(a => a.timestamp));
      const timeRemaining = LOCKOUT_DURATION - (now - oldestAttempt);
      
      if (timeRemaining > 0) {
        setIsLockedOut(true);
        setLockoutTimeRemaining(Math.ceil(timeRemaining / 1000));
        return true;
      }
    }
    
    setIsLockedOut(false);
    return false;
  }, [loginAttempts]);

  // Validación en tiempo real con debounce
  const validateEmailField = useCallback(
    debounce((email: string) => {
      const sanitized = sanitizeInput(email);
      const result = validateEmailDetailed(sanitized);
      
      if (!result.isValid && email.length > 0) {
        setFieldErrors(prev => ({ ...prev, email: result.error! }));
      } else {
        setFieldErrors(prev => {
          const { email, ...rest } = prev;
          return rest;
        });
      }
    }, 500),
    []
  );

  // Registrar intento fallido
  const registerFailedAttempt = (email: string) => {
    const newAttempt: LoginAttempt = {
      timestamp: Date.now(),
      email: sanitizeInput(email),
    };
    
    setLoginAttempts(prev => {
      const filtered = prev.filter(
        attempt => Date.now() - attempt.timestamp < ATTEMPT_WINDOW
      );
      return [...filtered, newAttempt];
    });
  };

  const onSubmit = async (data: LoginFormInputs) => {
    // Verificar bloqueo por intentos fallidos
    if (checkLockout()) {
      toast.error(
        "Cuenta temporalmente bloqueada",
        `Demasiados intentos fallidos. Intenta en ${Math.ceil(lockoutTimeRemaining / 60)} minutos`
      );
      return;
    }

    setIsSubmitting(true);
    setSecurityWarning("");
    
    try {
      // Sanitizar inputs antes de enviar
      const sanitizedEmail = sanitizeInput(data.email.toLowerCase());
      const sanitizedPassword = data.password; // No sanitizar password

      // Validación final antes de enviar
      const emailValidation = validateEmailDetailed(sanitizedEmail);
      const passwordValidation = validatePasswordDetailed(sanitizedPassword);

      if (!emailValidation.isValid) {
        setError("email", { message: emailValidation.error });
        toast.error("Email inválido", emailValidation.error!);
        setIsSubmitting(false);
        return;
      }

      if (!passwordValidation.isValid) {
        setError("password", { message: passwordValidation.error });
        toast.error("Contraseña inválida", passwordValidation.error!);
        setIsSubmitting(false);
        return;
      }

      // Simular delay para prevenir timing attacks
      const startTime = Date.now();
      
      const user = await login(sanitizedEmail, sanitizedPassword);
      
      // Asegurar tiempo mínimo de respuesta (prevenir timing attacks)
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - elapsedTime));
      }

      if (!user) {
        // Registrar intento fallido
        registerFailedAttempt(sanitizedEmail);
        
        const remainingAttempts = MAX_LOGIN_ATTEMPTS - loginAttempts.length - 1;
        
        if (remainingAttempts <= 2 && remainingAttempts > 0) {
          setSecurityWarning(
            `⚠️ Advertencia: Te quedan ${remainingAttempts} intentos antes de bloqueo temporal`
          );
        }
        
        toast.error(
          "Credenciales incorrectas",
          "Email o contraseña incorrectos. Verifica tus datos."
        );
      } else {
        // Login exitoso - limpiar intentos
        setLoginAttempts([]);
        setSecurityWarning("");
        
        toast.success("¡Bienvenido!", `Has iniciado sesión como ${user.nombre}`);
        
        // Guardar en localStorage si "recordar" está marcado
        if (data.remember) {
          localStorage.setItem("rememberEmail", sanitizedEmail);
        } else {
          localStorage.removeItem("rememberEmail");
        }
        
        reset();
      }
    } catch (error) {
      console.error("Login error:", error);
      registerFailedAttempt(data.email);
      toast.error(
        "Error del servidor",
        "Ha ocurrido un error. Por favor intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg shadow-lg" noValidate>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Iniciar Sesión</h2>
            <p className="text-sm text-muted-foreground mt-2">Accede a tu cuenta de forma segura</p>
          </div>

          {/* Advertencia de bloqueo */}
          {isLockedOut && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200">Cuenta bloqueada temporalmente</p>
                <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                  Demasiados intentos fallidos. Podrás intentar nuevamente en {Math.ceil(lockoutTimeRemaining / 60)} minutos.
                </p>
              </div>
            </div>
          )}

          {/* Advertencia de seguridad */}
          {securityWarning && !isLockedOut && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-start gap-2">
              <Shield className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800 dark:text-yellow-200">{securityWarning}</p>
            </div>
          )}

          {/* Email */}
          <Controller
            name="email"
            control={control}
            rules={{ 
              required: "Email es requerido",
              validate: (value) => {
                const result = validateEmailDetailed(value);
                return result.isValid || result.error!;
              }
            }}
            render={({ field }) => (
              <InputField
                name={field.name}
                label="Correo Electrónico"
                type="email"
                placeholder="tu@email.com"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  validateEmailField(value);
                }}
                error={fieldErrors.email || errors.email?.message}
                required
                disabled={isLockedOut}
                autoComplete="email"
              />
            )}
          />

          {/* Password */}
          <div className="relative">
            <Controller
              name="password"
              control={control}
              rules={{ 
                required: "Contraseña es requerida",
                minLength: {
                  value: 8,
                  message: "Mínimo 8 caracteres"
                }
              }}
              render={({ field }) => (
                <InputField
                  name={field.name}
                  label="Contraseña"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.password?.message}
                  required
                  disabled={isLockedOut}
                  autoComplete="current-password"
                />
              )}
            />
          </div>

          {/* Recordar y Olvidé Contraseña */}
          <div className="flex items-center justify-between">
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  Recordarme
                </label>
              )}
            />
            <a href="/forgot-password" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || isLockedOut}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Procesando...
              </span>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>

          {/* Información de seguridad */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>Conexión segura y encriptada</span>
            </div>
          </div>
        </form>

        {/* Registro */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
              Regístrate aquí
            </a>
          </p>
        </div>

        <ToastContainer messages={toast.messages} onClose={toast.removeToast} />
      </div>
    </div>
  );
}
