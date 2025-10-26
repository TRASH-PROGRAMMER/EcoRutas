import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  es: {
    translation: {
      "Discover Sustainable Community Tourism": "Descubre el Turismo Comunitario Sostenible",
      "Explore Routes": "Explorar Rutas",
      "Meet Guides": "Conocer Guías",
      "Search Routes": "Buscar Rutas",
      "About Us": "Sobre Nosotros",
      "Contact": "Contacto",
      // agrega aquí todas las claves necesarias para tu app
    },
  },
  en: {
    translation: {
      "Discover Sustainable Community Tourism": "Discover Sustainable Community Tourism",
      "Explore Routes": "Explore Routes",
      "Meet Guides": "Meet Guides",
      "Search Routes": "Search Routes",
      "About Us": "About Us",
      "Contact": "Contact",
      // agrega equivalentes en inglés
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
