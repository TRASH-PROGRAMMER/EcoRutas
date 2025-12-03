import { useCallback } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';

/**
 * Hook personalizado para facilitar el uso de funciones de accesibilidad
 * en cualquier componente de la aplicación.
 * 
 * @returns Objeto con funciones y propiedades de accesibilidad útiles
 */
export const useAccessibilityFeatures = () => {
  const accessibility = useAccessibility();

  /**
   * Función helper para manejar eventos onMouseEnter con lectura por voz
   */
  const createSpeakOnHover = useCallback(
    (text: string) => () => {
      if (accessibility.speechEnabled) {
        accessibility.speakText(text);
      }
    },
    [accessibility]
  );

  /**
   * Función helper para crear clases CSS responsivas al tema oscuro
   */
  const themeClass = useCallback(
    (lightClasses: string, darkClasses: string) => {
      return accessibility.darkMode ? darkClasses : lightClasses;
    },
    [accessibility.darkMode]
  );

  /**
   * Función helper para obtener clases de color según el modo
   */
  const getThemeColors = useCallback(() => {
    return {
      background: accessibility.darkMode ? 'bg-gray-900' : 'bg-white',
      text: accessibility.darkMode ? 'text-white' : 'text-gray-900',
      border: accessibility.darkMode ? 'border-gray-700' : 'border-gray-200',
      hover: accessibility.darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
      card: accessibility.darkMode ? 'bg-gray-800' : 'bg-gray-50',
      primary: accessibility.darkMode ? 'bg-emerald-700' : 'bg-emerald-600',
      primaryHover: accessibility.darkMode ? 'hover:bg-emerald-600' : 'hover:bg-emerald-700',
    };
  }, [accessibility.darkMode]);

  /**
   * Función para verificar si el tamaño de fuente es mayor que normal
   */
  const isLargeFontSize = useCallback(() => {
    return accessibility.fontSize === 'large' || accessibility.fontSize === 'extra-large';
  }, [accessibility.fontSize]);

  /**
   * Función para obtener el multiplicador del tamaño de fuente actual
   */
  const getFontSizeMultiplier = useCallback(() => {
    const multipliers = {
      'small': 0.875,
      'normal': 1,
      'large': 1.125,
      'extra-large': 1.25,
    };
    return multipliers[accessibility.fontSize];
  }, [accessibility.fontSize]);

  /**
   * Función para obtener props de accesibilidad para elementos interactivos
   */
  const getAccessibleProps = useCallback(
    (label: string, description?: string) => ({
      'aria-label': label,
      'aria-description': description,
      onMouseEnter: createSpeakOnHover(description || label),
      onFocus: createSpeakOnHover(description || label),
    }),
    [createSpeakOnHover]
  );

  /**
   * Función para verificar si hay algún filtro de daltonismo activo
   */
  const hasColorBlindnessFilter = useCallback(() => {
    return accessibility.colorBlindnessMode !== 'none';
  }, [accessibility.colorBlindnessMode]);

  /**
   * Función para obtener el nombre del idioma actual
   */
  const getCurrentLanguageName = useCallback(() => {
    return accessibility.language === 'es' ? 'Español' : 'English';
  }, [accessibility.language]);

  /**
   * Función para anunciar un mensaje importante (útil para notificaciones)
   */
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (accessibility.speechEnabled) {
        accessibility.speakText(message);
      }
      
      // También crear un elemento ARIA live para lectores de pantalla
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.textContent = message;
      
      document.body.appendChild(liveRegion);
      
      setTimeout(() => {
        document.body.removeChild(liveRegion);
      }, 1000);
    },
    [accessibility]
  );

  return {
    // Todas las propiedades del contexto original
    ...accessibility,
    
    // Funciones helpers adicionales
    createSpeakOnHover,
    themeClass,
    getThemeColors,
    isLargeFontSize,
    getFontSizeMultiplier,
    getAccessibleProps,
    hasColorBlindnessFilter,
    getCurrentLanguageName,
    announce,
  };
};

/**
 * Hook para crear props HTML accesibles fácilmente
 */
export const useAccessibleElement = (label: string, description?: string) => {
  const { speechEnabled, speakText } = useAccessibility();

  const handleInteraction = useCallback(() => {
    if (speechEnabled) {
      speakText(description || label);
    }
  }, [speechEnabled, speakText, label, description]);

  return {
    'aria-label': label,
    ...(description && { 'aria-description': description }),
    onMouseEnter: handleInteraction,
    onFocus: handleInteraction,
  };
};

/**
 * Hook para obtener clases de tema dinámicas
 */
export const useThemeClasses = () => {
  const { darkMode } = useAccessibility();

  return {
    container: darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
    card: darkMode ? 'bg-gray-800' : 'bg-gray-50',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    hover: darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
      secondary: darkMode ? 'text-gray-300' : 'text-gray-600',
      muted: darkMode ? 'text-gray-400' : 'text-gray-500',
    },
    button: {
      primary: darkMode 
        ? 'bg-emerald-700 hover:bg-emerald-600 text-white' 
        : 'bg-emerald-600 hover:bg-emerald-700 text-white',
      secondary: darkMode
        ? 'bg-gray-700 hover:bg-gray-600 text-white'
        : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    },
  };
};
