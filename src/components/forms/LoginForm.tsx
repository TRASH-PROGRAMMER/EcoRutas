// LoginForm.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { InputField } from "../InputField";
import { Button } from "@/components/ui/button";
import { useToast, ToastContainer } from "@/components/Toast";

interface LoginFormInputs {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginForm() {
  const { login } = useAuth();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    setIsSubmitting(true);
    try {
      const user = await login(data.email, data.password);
      if (!user) {
        toast.error("Usuario o contraseña incorrectos", "Intenta nuevamente");
      } else {
        toast.success("¡Bienvenido!", `Has iniciado sesión como ${user.nombre}`);
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error del servidor", "Intenta nuevamente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-foreground text-center">Iniciar Sesión</h2>

          {/* Email */}
          <Controller
            name="email"
            control={control}
            rules={{ required: "Email es requerido" }}
            render={({ field }) => (
              <InputField
                name={field.name}        // <--- IMPORTANTE
                label="Correo Electrónico"
                type="email"
                placeholder="tu@email.com"
                value={field.value}
                onChange={field.onChange}
                error={errors.email?.message}
                required
              />
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={control}
            rules={{ required: "Contraseña es requerida" }}
            render={({ field }) => (
              <InputField
                name={field.name}        // <--- IMPORTANTE
                label="Contraseña"
                type="password"
                placeholder="Contraseña"
                value={field.value}
                onChange={field.onChange}
                error={errors.password?.message}
                required
              />
            )}
          />

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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Procesando..." : "Iniciar Sesión"}
          </Button>
        </form>

        <ToastContainer messages={toast.messages} onClose={toast.removeToast} />
      </div>
    </div>
  );
}
