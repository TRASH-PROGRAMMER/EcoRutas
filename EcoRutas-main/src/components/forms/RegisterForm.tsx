// RegisterForm.tsx
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/InputField";
import { PasswordStrength } from "@/components/PasswordStrength";
import { useToast, ToastContainer } from "@/components/Toast";

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
  const [message, setMessage] = useState("");

  // Watch para barra de progreso y fortaleza de contraseña
  const watchedFields = watch();
  const password = watch("password") || "";

  // Actualizar progreso
  useEffect(() => {
    const fields = Object.values(watchedFields);
    const filledFields = fields.filter(Boolean).length;
    const termsCount = acceptedTerms ? 1 : 0;
    setProgress(((filledFields + termsCount) / 6) * 100);
  }, [watchedFields, acceptedTerms]);

  const handleFieldChange = (fieldName: keyof RegisterFormInputs, value: string) => {
    setValue(fieldName, value as any);
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    if (!acceptedTerms) {
      toast.warning('Términos requeridos', 'Debes aceptar los términos y condiciones');
      return;
    }

    if (data.password !== data.confirmPassword) {
      setFieldErrors({ confirmPassword: "Las contraseñas no coinciden" });
      toast.error("Error", "Las contraseñas deben coincidir");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await registerUser({
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        rol: data.rol
      });

      if (!user) {
        toast.error('Error al registrar', 'El correo ya está registrado');
      } else {
        toast.success('¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente');
        setMessage(`¡Registro exitoso! Bienvenido ${user.nombre}`);
        reset();
        setAcceptedTerms(false);
        setProgress(0);
      }
    } catch (error) {
      toast.error('Error del servidor', 'Por favor intenta nuevamente');
      console.error('Error:', error);
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
            {/* Barra de progreso */}
            <div className="mb-6">
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-primary rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <InputField
                label="Nombre"
                name="nombre"
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={watchedFields.nombre || ""}
                onChange={(value) => handleFieldChange("nombre", value)}
                error={fieldErrors.nombre || errors.nombre?.message}
                helpText="Mínimo 2 caracteres"
                required
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={watchedFields.email || ""}
                onChange={(value) => handleFieldChange("email", value)}
                error={fieldErrors.email || errors.email?.message}
                helpText="Usaremos este email para contactarte"
                required
              />

              <div>
                <InputField
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={watchedFields.password || ""}
                  onChange={(value) => handleFieldChange("password", value)}
                  error={fieldErrors.password || errors.password?.message}
                  helpText="Debe incluir mayúsculas y números"
                  required
                />
                {password && <PasswordStrength password={password} showLabel showRequirements />}
              </div>

              <InputField
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={watchedFields.confirmPassword || ""}
                onChange={(value) => handleFieldChange("confirmPassword", value)}
                error={fieldErrors.confirmPassword || errors.confirmPassword?.message}
                compareValue={password}
                required
              />

              <div>
                <label htmlFor="rol" className="block text-sm font-medium text-foreground mb-1.5">
                  Rol <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  {...register("rol")}
                  className="mt-1 w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all bg-white"
                  required
                >
                  <option value="">Selecciona un rol</option>
                  <option value="administrador">Administrador de localidad</option>
                  <option value="turista">Turista</option>
                </select>
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

              <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                {isSubmitting ? 'Registrando...' : 'Registrar'}
              </Button>

              <p className="text-center text-sm text-muted-foreground pt-4">
                ¿Ya tienes cuenta?{' '}
                <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">Inicia sesión</a>
              </p>

              {/* Mensaje de registro exitoso */}
              {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Contenedor de notificaciones Toast */}
      <ToastContainer messages={toast.messages} onClose={toast.removeToast} />
    </div>
  );
}
