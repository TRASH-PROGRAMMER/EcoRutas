//import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('/');

  // Detectar scroll para cambiar estilo
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevenir scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const navLinks = [
    { href: "/rutas", label: "Rutas", description: "Explora experiencias" },
    { href: "/guias", label: "Guías Locales", description: "Conoce a los expertos" },
    { href: "/comunidades", label: "Comunidades", description: "Descubre las culturas" },
    { href: "/nosotros", label: "Nosotros", description: "Nuestra historia" },
  ];

  const handleLinkClick = (href: string) => {
    setActiveLink(href);
    setOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200' 
            : 'bg-white/80 backdrop-blur-md border-b border-gray-100'
        }`}
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo mejorado */}
            <a 
              href="/" 
              className="flex items-center gap-2 sm:gap-3 group relative focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg px-2 py-1"
              aria-label="EcoRutas - Turismo Comunitario Sostenible, ir a página de inicio"
              onClick={() => handleLinkClick('/')}
            >
              {/* Logo con animación mejorada */}
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-xl text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
                  EcoRutas
                </span>
                <span className="hidden sm:block text-[10px] text-gray-500 font-medium -mt-0.5">
                  Turismo Sostenible
                </span>
              </div>
            </a>

            {/* Desktop Navigation - Mejorado */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = activeLink === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className={`relative px-4 py-2 text-sm lg:text-base font-medium rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                      isActive 
                        ? 'text-emerald-600 bg-emerald-50' 
                        : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                    
                    {/* Indicador de página activa */}
                    {isActive && (
                      <span 
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-600 rounded-full"
                        aria-hidden="true"
                      />
                    )}
                    
                    {/* Tooltip con descripción */}
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap pointer-events-none">
                      {link.description}
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </span>
                  </a>
                );
              })}
              
              {/* CTA Button mejorado */}
              <a
                href="/reservar"
                onClick={() => handleLinkClick('/reservar')}
                className="ml-2 px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                aria-label="Reservar tu experiencia ahora"
              >
                Reservar Ahora
              </a>
            </div>

            {/* Mobile Menu Button - Mejorado */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Barra de progreso de scroll */}
        <div 
          className="h-0.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 transition-all duration-300 origin-left"
          style={{ 
            transform: `scaleX(${Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1), 1)})` 
          }}
          role="progressbar"
          aria-label="Progreso de lectura de la página"
          aria-valuenow={Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1)) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </nav>

      {/* Mobile Menu - Completamente rediseñado */}
      {open && (
        <>
          {/* Overlay con blur */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          
          {/* Panel lateral */}
          <div
            id="mobile-menu"
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden animate-slideInRight overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación móvil"
          >
            {/* Header del menú móvil */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <Leaf className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-white">EcoRutas</h2>
                    <p className="text-xs text-emerald-50">Turismo Sostenible</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Cerrar menú"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Links del menú móvil */}
            <nav className="p-6" aria-label="Menú móvil">
              <ul className="space-y-2">
                {navLinks.map((link, index) => {
                  const isActive = activeLink === link.href;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => handleLinkClick(link.href)}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-600 shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-base mb-0.5">
                            {link.label}
                          </div>
                          <div className="text-xs text-gray-500 group-hover:text-emerald-600 transition-colors">
                            {link.description}
                          </div>
                        </div>
                        <ChevronRight 
                          className={`h-5 w-5 transition-transform duration-200 ${
                            isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:translate-x-1'
                          }`}
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* CTA en menú móvil */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <a
                  href="/reservar"
                  onClick={() => handleLinkClick('/reservar')}
                  className="block w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-center rounded-xl hover:from-emerald-700 hover:to-emerald-800 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Reservar Ahora
                </a>
              </div>

              {/* Info adicional en menú móvil */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  Conectamos viajeros con comunidades rurales para experiencias auténticas y sostenibles
                </p>
              </div>
            </nav>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { 
            transform: translateX(100%);
            opacity: 0;
          }
          to { 
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
};

export default Navbar;