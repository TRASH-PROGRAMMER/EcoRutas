import Footer from "@/components/Footer";
import { Users, Award, MapPin, Phone, Mail, Star } from "lucide-react";

const Guias = () => {
  const guiasDestacados = [
    {
      nombre: "María González",
      especialidad: "Ecoturismo y Fauna Local",
      experiencia: "8 años",
      idiomas: ["Español", "Inglés"],
      rating: 4.9,
      imagen: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop",
      descripcion: "Experta en rutas ecológicas y observación de aves en la región costera."
    },
    {
      nombre: "Carlos Mendoza",
      especialidad: "Historia y Cultura",
      experiencia: "12 años",
      idiomas: ["Español", "Inglés", "Francés"],
      rating: 5.0,
      imagen: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400&h=400&fit=crop",
      descripcion: "Historiador local especializado en patrimonio cultural de Manabí."
    },
    {
      nombre: "Ana Vera",
      especialidad: "Aventura y Deportes",
      experiencia: "5 años",
      idiomas: ["Español", "Inglés"],
      rating: 4.8,
      imagen: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
      descripcion: "Guía de deportes acuáticos y aventuras extremas en la costa."
    }
  ];

  const servicios = [
    {
      icon: <MapPin className="w-6 h-6 text-emerald-600" />,
      titulo: "Tours Personalizados",
      descripcion: "Rutas adaptadas a tus intereses y necesidades"
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      titulo: "Grupos Pequeños",
      descripcion: "Experiencias íntimas y personalizadas"
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      titulo: "Certificados",
      descripcion: "Guías certificados por el Ministerio de Turismo"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="pt-12 pb-16 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Guías Locales Certificados</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Conecta con guías comunitarios expertos que te mostrarán lo mejor de Manabí. 
            Todos nuestros guías están certificados y comprometidos con el turismo sostenible.
          </p>
        </div>

        {/* Servicios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {servicios.map((servicio, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg transition-shadow text-center">
              <div className="mb-4 flex justify-center">{servicio.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{servicio.titulo}</h3>
              <p className="text-gray-600">{servicio.descripcion}</p>
            </div>
          ))}
        </div>

        {/* Guías Destacados */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Guías Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guiasDestacados.map((guia, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow hover:shadow-lg transition-shadow">
                <img src={guia.imagen} alt={guia.nombre} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{guia.nombre}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{guia.rating}</span>
                  </div>
                  <p className="text-sm text-emerald-600 font-medium mb-2">{guia.especialidad}</p>
                  <p className="text-gray-600 text-sm mb-4">{guia.descripcion}</p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>{guia.experiencia} de experiencia</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{guia.idiomas.join(", ")}</span>
                    </div>
                  </div>
                  <button className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                    Ver Perfil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cómo Funciona */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-8">¿Cómo Funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["Explora Perfiles", "Contacta Directamente", "Personaliza tu Tour", "Disfruta"].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {idx + 1}
                </div>
                <h3 className="font-semibold mb-2">{step}</h3>
                <p className="text-sm text-gray-600">
                  {idx === 0 && "Revisa los guías y sus especialidades"}
                  {idx === 1 && "Comunícate con el guía de tu elección"}
                  {idx === 2 && "Diseña la experiencia perfecta"}
                  {idx === 3 && "Vive una experiencia auténtica"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-emerald-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Eres Guía Local?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Únete a nuestra red de guías certificados y conecta con viajeros que buscan experiencias auténticas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-600 px-6 py-3 rounded-md hover:opacity-90 transition-opacity font-medium">
              Registrarme como Guía
            </button>
            <button className="border-2 border-white px-6 py-3 rounded-md hover:bg-white hover:text-emerald-600 transition-colors font-medium">
              Más Información
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Guias;
