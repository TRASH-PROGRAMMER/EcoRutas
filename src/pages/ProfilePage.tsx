// pages/ProfilePage.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/context/AuthContext";

const profileSchema = z.object({
  nombre: z.string().min(3, "Debe tener al menos 3 caracteres").max(100),
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(255),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
  const { user,  } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombre: user?.nombre || "",
      email: user?.email || "",
      password: "",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    // Simula actualización de perfil
    if (!user) return;
    const updatedUser: User = {
      ...user,
      nombre: data.nombre,
      email: data.email,
      password: data.password || user.password,
    };
    toast.success("Perfil actualizado con éxito");
    console.log("Perfil actualizado:", updatedUser);
  };

  return (
    <div className="min-h-screen bg-background w-full py-8">
      <div className="container max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Mi Perfil</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Juan Pérez" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder="correo@ejemplo.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="Nueva contraseña" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="submit" size="lg">
                Guardar Cambios
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => form.reset()}>
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;
