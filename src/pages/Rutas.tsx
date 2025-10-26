import Footer from "@/components/Footer";
import { Mountain, Waves, TreePine, Bird, Clock, Users, TrendingUp, MapPin, Calendar, Compass } from "lucide-react";

const Rutas = () => {
  const categorias = [
    { nombre: "Todas", count: 24 },
    { nombre: "Montaña", count: 8 },
    { nombre: "Costa", count: 10 },
    { nombre: "Bosque", count: 6 }
  ];

  const rutas = [
    {
      nombre: "Cascadas del Bosque Nublado",
      ubicacion: "Zona Alta de Manabí",
      duracion: "6-8 horas",
      dificultad: "Moderada",
      participantes: "4-12 personas",
      temporada: "Todo el año",
      precio: "$45",
      categoria: "Montaña",
      imagen: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjI0Tab44HflZe-mYfr_1p18_IyIAW0vqp6YdZ2dugHaiWSio4NRTtRiLtXTvHwpu8QtH7dAqpeK4ZG1jK1buQk3Kf79zykAmXqkMva1XY9eItpAe-zOtXBgatQVQs7orb8400_ZCikouis/s1600/Manabi+el+corazon+de+la+costa+ecuatoriana.jpg",
      descripcion: "Explora cascadas escondidas en el bosque nublado, con flora y fauna endémica. Incluye almuerzo campestre.",
      destacados: ["3 cascadas principales", "Observación de aves", "Almuerzo incluido", "Guía experto"],
      tags: ["Naturaleza", "Aventura", "Fotografía"]
    },
    {
      nombre: "Ruta de los Pescadores",
      ubicacion: "Puerto López",
      duracion: "5 horas",
      dificultad: "Fácil",
      participantes: "6-15 personas",
      temporada: "Mayo - Octubre",
      precio: "$35",
      categoria: "Costa",
      imagen: "data:image/jpeg;base64,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",
      descripcion: "Acompaña a pescadores artesanales en su jornada diaria. Aprende técnicas ancestrales y disfruta pescado fresco.",
      destacados: ["Pesca artesanal", "Preparación de ceviche", "Snorkeling opcional", "Avistamiento de delfines"],
      tags: ["Cultural", "Gastronómico", "Marino"]
    },
    {
      nombre: "Sendero del Café y Cacao",
      ubicacion: "Valle de Jipijapa",
      duracion: "4-5 horas",
      dificultad: "Fácil",
      participantes: "4-20 personas",
      temporada: "Todo el año",
      precio: "$30",
      categoria: "Bosque",
      imagen: "https://img.goraymi.com/2015/08/13/d23fc7919f68f302ef580debc76d3bd7_xl.jpg",
      descripcion: "Recorre plantaciones de café y cacao orgánico. Participa en la cosecha y procesamiento tradicional.",
      destacados: ["Tour de plantación", "Degustación", "Taller de chocolate", "Compra directa"],
      tags: ["Agroturismo", "Gastronómico", "Educativo"]
    },
    {
      nombre: "Avistamiento de Ballenas",
      ubicacion: "Bahía de Machalilla",
      duracion: "3-4 horas",
      dificultad: "Fácil",
      participantes: "8-30 personas",
      temporada: "Junio - Septiembre",
      precio: "$60",
      categoria: "Costa",
      imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
      descripcion: "Observa ballenas jorobadas en su migración anual. Experiencia marina inolvidable con biólogos marinos.",
      destacados: ["Ballenas jorobadas", "Biólogo a bordo", "Equipo de snorkel", "Refrigerio incluido"],
      tags: ["Fauna", "Marino", "Conservación"]
    },
    {
      nombre: "Caminata Nocturna del Bosque",
      ubicacion: "Reserva Ecológica",
      duracion: "3 horas",
      dificultad: "Moderada",
      participantes: "6-12 personas",
      temporada: "Todo el año",
      precio: "$40",
      categoria: "Bosque",
      imagen: "data:image/jpeg;base64,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",
      descripcion: "Descubre la vida nocturna del bosque tropical. Observa insectos bioluminiscentes y fauna nocturna.",
      destacados: ["Fauna nocturna", "Insectos luminosos", "Linternas incluidas", "Guía especializado"],
      tags: ["Aventura", "Naturaleza", "Único"]
    }
  ];

  const filtros = [
    { label: "Dificultad", icon: <TrendingUp className="w-4 h-4" />, opciones: ["Fácil", "Moderada", "Difícil"] },
    { label: "Duración", icon: <Clock className="w-4 h-4" />, opciones: ["Medio día", "Día completo", "Varios días"] },
    { label: "Categoría", icon: <Compass className="w-4 h-4" />, opciones: ["Montaña", "Costa", "Bosque"] }
  ];

  const getDificultadColor = (dificultad: string) => {
    switch(dificultad) {
      case "Fácil": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Moderada": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Difícil": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="pt-12 pb-16 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Rutas Eco-Turísticas</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explora rutas cuidadosamente diseñadas que combinan aventura, naturaleza y cultura local. 
            Todas nuestras rutas apoyan a comunidades locales y promueven el turismo sostenible.
          </p>
        </div>

        {/* Grid de Rutas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {rutas.map((ruta, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
              {/* Imagen */}
              <img src={ruta.imagen} alt={ruta.nombre} className="w-full h-48 object-cover" />
              
              {/* Contenido */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-3">
                  <h3 className="text-xl font-semibold mb-2">{ruta.nombre}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{ruta.ubicacion}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 flex-1">{ruta.descripcion}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {ruta.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{ruta.duracion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{ruta.participantes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{ruta.temporada}</span>
                  </div>
                  <div className={`border rounded px-2 py-1 text-center ${getDificultadColor(ruta.dificultad)}`}>
                    {ruta.dificultad}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold mb-2">Incluye:</p>
                  <ul className="text-xs space-y-1">
                    {ruta.destacados.slice(0, 3).map((destacado, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span className="text-gray-600">{destacado}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500">Desde</div>
                    <div className="text-2xl font-bold text-primary">{ruta.precio}</div>
                    <div className="text-xs text-gray-500">por persona</div>
                  </div>
                  <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Rutas;

