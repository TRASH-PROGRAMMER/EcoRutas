import React from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';

/**
 * Componente de ejemplo que demuestra cómo usar el hook de accesibilidad
 * en otros componentes de la aplicación.
 * 
 * Este componente puede ser usado como referencia para implementar
 * características de accesibilidad en cualquier parte de la aplicación.
 */
const AccessibilityExample: React.FC = () => {
  const { 
    language, 
    fontSize, 
    darkMode, 
    speechEnabled, 
    speakText,
    colorBlindnessMode 
  } = useAccessibility();

  // Ejemplo de uso de lectura por voz en un botón
  const handleButtonClick = () => {
    speakText('Has hecho clic en el botón de ejemplo');
    console.log('Botón clickeado');
  };

  // Ejemplo de texto que se lee al pasar el cursor
  const handleMouseEnter = (text: string) => {
    if (speechEnabled) {
      speakText(text);
    }
  };

  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <h2 className="text-2xl font-bold mb-4">Ejemplo de Accesibilidad</h2>
      
      {/* Mostrar configuración actual */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="font-medium">Idioma actual:</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {language === 'es' ? 'Español 🇪🇸' : 'English 🇬🇧'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Tamaño de fuente:</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {fontSize}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Modo oscuro:</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            darkMode ? 'bg-emerald-700' : 'bg-gray-100'
          }`}>
            {darkMode ? 'Activado' : 'Desactivado'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Lectura por voz:</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            speechEnabled ? 'bg-emerald-700 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {speechEnabled ? 'Activado' : 'Desactivado'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Filtro de color:</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            colorBlindnessMode !== 'none' ? 'bg-blue-700 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {colorBlindnessMode === 'none' ? 'Ninguno' : colorBlindnessMode}
          </span>
        </div>
      </div>

      {/* Ejemplos interactivos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-3">Ejemplos Interactivos:</h3>
        
        {/* Botón con lectura por voz */}
        <button
          onClick={handleButtonClick}
          onMouseEnter={() => handleMouseEnter('Botón de ejemplo con lectura por voz')}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            darkMode 
              ? 'bg-emerald-700 hover:bg-emerald-600 text-white' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          Haz clic aquí
        </button>

        {/* Card con hover para lectura */}
        <div
          onMouseEnter={() => handleMouseEnter('Tarjeta informativa sobre accesibilidad')}
          className={`p-4 rounded-lg border transition-colors ${
            darkMode 
              ? 'border-gray-700 bg-gray-700/50 hover:bg-gray-700' 
              : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <h4 className="font-semibold mb-2">Tarjeta Accesible</h4>
          <p className="text-sm">
            Pasa el cursor sobre esta tarjeta para escuchar su contenido cuando 
            la lectura por voz esté activada.
          </p>
        </div>

        {/* Lista con elementos que se pueden leer */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <h4 className="font-semibold mb-3">Lista de características:</h4>
          <ul className="space-y-2">
            {[
              'Cambio de idioma dinámico',
              'Ajuste de tamaño de fuente',
              'Filtros para daltonismo',
              'Modo oscuro adaptativo',
              'Lectura por voz interactiva'
            ].map((item, index) => (
              <li
                key={index}
                onMouseEnter={() => handleMouseEnter(item)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors cursor-default ${
                  darkMode ? 'hover:bg-gray-600' : 'hover:bg-white'
                }`}
              >
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Nota informativa */}
      <div className={`mt-6 p-4 rounded-lg border-l-4 ${
        darkMode 
          ? 'bg-blue-900/20 border-blue-700' 
          : 'bg-blue-50 border-blue-600'
      }`}>
        <p className="text-sm">
          <strong>Nota:</strong> Este es un componente de ejemplo que muestra cómo 
          integrar las características de accesibilidad en cualquier parte de tu aplicación.
          Todas las configuraciones se sincronizan automáticamente con el contexto global.
        </p>
      </div>
    </div>
  );
};

export default AccessibilityExample;
