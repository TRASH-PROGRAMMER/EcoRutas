import { Link } from "react-router-dom";
import { Leaf, Facebook, Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground/5 border-t border-border">
      <div className="container px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-7 w-7 text-primary" aria-hidden="true" />
              <span className="font-bold text-xl text-foreground">EcoRutas</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Conectando viajeros con comunidades rurales para un turismo sostenible y auténtico.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explorar */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Explorar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/rutas" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Rutas Eco-turísticas
                </Link>
              </li>
              <li>
                <Link to="/guias" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Guías Locales
                </Link>
              </li>
              <li>
                <Link to="/comunidades" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Comunidades
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/nosotros" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/sostenibilidad" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sostenibilidad
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <a href="mailto:contacto@ecorutas.com" className="hover:text-primary transition-colors">
                  contacto@ecorutas.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} EcoRutas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
