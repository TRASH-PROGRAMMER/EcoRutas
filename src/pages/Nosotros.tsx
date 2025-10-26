import { useState } from "react";
import Footer from "@/components/Footer";
import { Mail, Phone } from "lucide-react";

const Nosotros = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: ""
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validarEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: {[key: string]: string} = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.email.trim()) newErrors.email = "El correo es obligatorio";
    else if (!validarEmail(formData.email)) newErrors.email = "Correo inválido";
    if (!formData.mensaje.trim()) newErrors.mensaje = "El mensaje es obligatorio";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Aquí podrías enviar los datos a un backend o servicio
    console.log("Formulario enviado:", formData);
    setEnviado(true);
    setFormData({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="pt-12 pb-16 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Sobre Nosotros</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Somos una organización dedicada a promover el turismo sostenible, conectando viajeros con comunidades locales.
            Nuestra misión es generar un impacto positivo en la cultura, economía y medio ambiente de cada lugar que visitamos.
          </p>
        </div>

        {/* Misión, Visión, Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-card p-6 rounded-lg border border-border text-center hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Misión</h3>
            <p className="text-sm text-muted-foreground">
              Fomentar experiencias auténticas de turismo comunitario que generen desarrollo local sostenible y conciencia ambiental.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border text-center hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Visión</h3>
            <p className="text-sm text-muted-foreground">
              Ser referentes en turismo sostenible en Ecuador, promoviendo la cultura local y la protección del medio ambiente.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border text-center hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Valores</h3>
            <p className="text-sm text-muted-foreground">
              Respeto, sostenibilidad, autenticidad, colaboración y transparencia en todas nuestras acciones.
            </p>
          </div>
        </div>

        {/* Contacto */}
        <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-bold mb-4 text-center">Contáctanos</h2>
          {enviado && (
            <div className="mb-4 text-green-600 text-center font-semibold">
              ¡Mensaje enviado correctamente!
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 text-sm ${
                  errors.nombre ? "border-red-500" : "border-border"
                }`}
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Correo</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 text-sm ${
                  errors.email ? "border-red-500" : "border-border"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mensaje</label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows={4}
                className={`w-full border rounded-md px-3 py-2 text-sm ${
                  errors.mensaje ? "border-red-500" : "border-border"
                }`}
              ></textarea>
              {errors.mensaje && <p className="text-red-500 text-xs mt-1">{errors.mensaje}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Enviar Mensaje
            </button>
          </form>

          {/* Información de contacto */}
          <div className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+593 99 123 4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>contacto@turismocomunitario.ec</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Nosotros;

