import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  es: {
    translation: {
      // Navegación
      "Discover Sustainable Community Tourism": "Descubre el Turismo Comunitario Sostenible",
      "Explore Routes": "Explorar Rutas",
      "Meet Guides": "Conocer Guías",
      "Search Routes": "Buscar Rutas",
      "About Us": "Sobre Nosotros",
      "Contact": "Contacto",
      
      // Accesibilidad
      "Accessibility Menu": "Menú de Accesibilidad",
      "Customize your experience": "Personaliza tu experiencia",
      "Language": "Idioma",
      "Font Size": "Tamaño de Fuente",
      "Color Blindness": "Daltonismo",
      "Dark Mode": "Modo Oscuro",
      "Text to Speech": "Lectura por Voz",
      "Reset Settings": "Restablecer Configuración",
      "Small": "Pequeña",
      "Normal": "Normal",
      "Large": "Grande",
      "Extra Large": "Extra Grande",
      "Activated": "Activado",
      "Deactivated": "Desactivado",
      "No Filter": "Sin Filtro",
      "Protanopia": "Protanopía",
      "Deuteranopia": "Deuteranopía",
      "Tritanopia": "Tritanopía",
      "Color Filters": "Filtros de Color",
      "Select a color filter for color blindness": "Selecciona un filtro de color para daltonismo",
      "Color Preview": "Vista previa de colores",
      "Hover over elements to hear their content": "Pasa el cursor sobre los elementos para escuchar su contenido",
    },
  },
  en: {
    translation: {
      // Navigation
      "Discover Sustainable Community Tourism": "Discover Sustainable Community Tourism",
      "Explore Routes": "Explore Routes",
      "Meet Guides": "Meet Guides",
      "Search Routes": "Search Routes",
      "About Us": "About Us",
      "Contact": "Contact",
      
      // Accessibility
      "Accessibility Menu": "Accessibility Menu",
      "Customize your experience": "Customize your experience",
      "Language": "Language",
      "Font Size": "Font Size",
      "Color Blindness": "Color Blindness",
      "Dark Mode": "Dark Mode",
      "Text to Speech": "Text to Speech",
      "Reset Settings": "Reset Settings",
      "Small": "Small",
      "Normal": "Normal",
      "Large": "Large",
      "Extra Large": "Extra Large",
      "Activated": "Activated",
      "Deactivated": "Deactivated",
      "No Filter": "No Filter",
      "Protanopia": "Protanopia",
      "Deuteranopia": "Deuteranopia",
      "Tritanopia": "Tritanopia",
      "Color Filters": "Color Filters",
      "Select a color filter for color blindness": "Select a color filter for color blindness",
      "Color Preview": "Color Preview",
      "Hover over elements to hear their content": "Hover over elements to hear their content",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "es",
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
