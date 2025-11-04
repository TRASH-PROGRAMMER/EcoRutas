import React, { useEffect } from "react";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Users, MapPin, Mail, Phone, User, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const reservationSchema = z.object({
  route: z.string().min(1, "Debes seleccionar una ruta"),
  date: z.date().refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), { message: "La fecha debe ser hoy o posterior" }),
  participants: z.string().refine((val) => { const num = parseInt(val); return !isNaN(num) && num >= 1 && num <= 20; }, { message: "Debe ser entre 1 y 20 personas" }),
  fullName: z.string().min(3).max(100).trim(),
  email: z.string().email().max(255).trim(),
  phone: z.string().min(8).max(20).regex(/^[0-9+\s()-]+$/).trim(),
  comments: z.string().max(500).optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

const availableRoutes = [
  { id: "1", name: "Caminata al Bosque Nublado", community: "Comunidad El Paraíso" },
  { id: "2", name: "Ruta del Río Cristalino", community: "San Miguel del Agua" },
  { id: "3", name: "Experiencia Cultural y Artesanías", community: "Comunidad Raíces Vivas" },
];

const Reservar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ❌ Protección y alerta si no está logueado
  useEffect(() => {
    if (!user) {
      alert("Debes iniciar sesión para realizar una reserva");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { comments: "" },
  });

  const onSubmit = (data: ReservationFormValues) => {
    const selectedRoute = availableRoutes.find(r => r.id === data.route);

    toast.success("¡Reserva Confirmada!", {
      description: `Tu reserva para "${selectedRoute?.name}" el ${format(data.date, "d 'de' MMMM, yyyy", { locale: es })} ha sido procesada. Te contactaremos pronto al ${data.email}.`,
      duration: 6000,
    });

    form.reset();
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="pt-8 pb-16">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-3">Reserva Tu Experiencia</h1>
            <p className="text-lg text-muted-foreground">Completa el formulario y conecta con las comunidades locales</p>
          </div>

          {/* Formulario */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Datos de Reservación</CardTitle>
              <CardDescription>Todos los campos marcados son obligatorios para confirmar tu reserva</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Route Selection */}
                  <FormField
                    control={form.control}
                    name="route"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                          Ruta Eco-turística
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una ruta" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableRoutes.map((route) => (
                              <SelectItem key={route.id} value={route.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{route.name}</span>
                                  <span className="text-xs text-muted-foreground">{route.community}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fecha y participantes */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Date Picker */}
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                            Fecha de Visita
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                  {field.value ? format(field.value, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                initialFocus
                                className="p-3 pointer-events-auto"
                                locale={es}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>Selecciona el día que deseas visitar</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Participants */}
                    <FormField
                      control={form.control}
                      name="participants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            Número de Personas
                          </FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Ej: 4" min="1" max="20" {...field} />
                          </FormControl>
                          <FormDescription>Mínimo 1, máximo 20 personas</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Información de Contacto</h3>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="h-4 w-4 text-primary" />
                              Nombre Completo
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Juan Pérez García" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                Correo Electrónico
                              </FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                Teléfono
                              </FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="+52 555 123 4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="comments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-primary" />
                              Comentarios Adicionales (Opcional)
                            </FormLabel>
                            <FormControl>
                              <Textarea placeholder="¿Tienes alguna preferencia?" className="resize-none" rows={4} {...field} />
                            </FormControl>
                            <FormDescription>Máximo 500 caracteres</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <Button type="submit" size="lg" className="flex-1" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? "Procesando..." : "Confirmar Reserva"}
                    </Button>
                    <Button type="button" variant="outline" size="lg" onClick={() => form.reset()}>
                      Limpiar Formulario
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-8 bg-muted/50 border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">Confirmación Inmediata</h4>
                  <p className="text-sm text-muted-foreground">
                    Recibirás un correo de confirmación con todos los detalles de tu reserva y las instrucciones para el día de la visita.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Reservar;
