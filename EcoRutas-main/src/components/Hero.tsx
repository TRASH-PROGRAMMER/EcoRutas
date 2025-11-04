import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-ecotourism.jpg";

const destinos = [
  "San Isidro",
  "Puerto López",
  "Valle de Jipijapa",
  "Bahía de Machalilla",
  "Reserva Ecológica",
  "Cordillera Chongón-Colonche",
  "Costa Sur de Manabí",
  "Bosque Protector",
  "Montecristi",
  "Rutas Rurales",
  "Parque Nacional Machalilla",
  "Reserva Privada"
];

const Hero = () => {
  const [destino, setDestino] = useState("");
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (destino.trim() === "") return;
    navigate(`/rutas?q=${encodeURIComponent(destino.trim())}`);
  };

  const handleChange = (value: string) => {
    setDestino(value);
    if (value.trim() === "") {
      setSugerencias([]);
    } else {
      const regex = new RegExp(`^${value.trim()}`, "i"); // coincidencia desde el inicio
      const filtradas = destinos.filter((d) => regex.test(d));
      setSugerencias(filtradas);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSugerenciaClick = (sugerencia: string) => {
    setDestino(sugerencia);
    setSugerencias([]);
    navigate(`/rutas?q=${encodeURIComponent(sugerencia)}`);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Turistas explorando rutas naturales con guía local en comunidad rural"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
            Descubre el Turismo
            <span className="block text-accent">Comunitario Sostenible</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Conecta con comunidades rurales auténticas. Experiencias eco-turísticas guiadas por locales.
          </p>

          {/* Search Bar con Autocompletado */}
          <div className="max-w-2xl mx-auto relative bg-white rounded-2xl shadow-2xl p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="¿A dónde quieres ir?"
                  className="pl-10 h-12 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                  value={destino}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyDown={handleEnter}
                />
                {/* Lista de sugerencias */}
                {sugerencias.length > 0 && (
                  <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg max-h-48 overflow-auto text-left">
                    {sugerencias.map((s, i) => (
                      <li
                        key={i}
                        className="px-3 py-2 hover:bg-primary/10 cursor-pointer"
                        onClick={() => handleSugerenciaClick(s)}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Button
                size="lg"
                className="h-12 gap-2 sm:w-auto w-full"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5" />
                <span>Buscar Rutas</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/rutas">Explorar Rutas</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white/30">
              <Link to="/guias">Conocer Guías</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
