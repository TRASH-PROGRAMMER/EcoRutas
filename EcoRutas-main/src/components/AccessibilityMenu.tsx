import React, { useState, useEffect } from 'react';
import {
  Settings,
  Globe,
  Type,
  Eye,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  RotateCcw,
  Plus,
  Minus,
  X,
  Palette,
  Check,
  Keyboard,
  Info,
} from 'lucide-react';
import { useAccessibility, type ColorBlindnessType, type FontSizeType, KEYBOARD_SHORTCUTS } from '@/context/AccessibilityContext';
import { useTranslation } from 'react-i18next';

const AccessibilityMenu: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'main' | 'color' | 'shortcuts'>('main');
  const [showShortcutHint, setShowShortcutHint] = useState(true);
  
  const {
    language,
    toggleLanguage,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    colorBlindnessMode,
    setColorBlindnessMode,
    darkMode,
    toggleDarkMode,
    speechEnabled,
    toggleSpeech,
    isSpeaking,
    speakText,
    resetAllSettings,
    shortcuts,
  } = useAccessibility();

  // Manejar atajo para abrir/cerrar el menú (Alt+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        if (!isOpen) {
          speakText('Menú de accesibilidad abierto');
        }
      }
      
      // ESC para cerrar el menú
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        speakText('Menú cerrado');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, speakText]);

  // Ocultar hint de atajo después de 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowShortcutHint(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  const colorBlindModes: { value: ColorBlindnessType; label: string; description: string }[] = [
    { value: 'none', label: 'Normal', description: 'Sin filtro de color' },
    { value: 'protanopia', label: 'Protanopía', description: 'Dificultad con el rojo' },
    { value: 'deuteranopia', label: 'Deuteranopía', description: 'Dificultad con el verde' },
    { value: 'tritanopia', label: 'Tritanopía', description: 'Dificultad con el azul' },
  ];

  const fontSizeLabels: Record<FontSizeType, string> = {
    'small': 'Pequeña',
    'normal': 'Normal',
    'large': 'Grande',
    'extra-large': 'Extra Grande',
  };

  const handleSpeak = (text: string) => {
    if (speechEnabled) {
      speakText(text);
    }
  };

  return (
    <>
      {/* Botón flotante de accesibilidad */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Hint de atajo de teclado */}
        {showShortcutHint && !isOpen && (
          <div 
            className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-fadeIn ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
          >
            Presiona <kbd className="px-2 py-1 bg-emerald-600 text-white rounded text-xs">Alt+A</kbd> para accesibilidad
          </div>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => handleSpeak('Menú de accesibilidad. Presiona Alt más A para abrir')}
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 ${
            darkMode 
              ? 'bg-emerald-700 text-white hover:bg-emerald-600' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
          aria-label={isOpen ? 'Cerrar menú de accesibilidad (Alt+A)' : 'Abrir menú de accesibilidad (Alt+A)'}
          aria-expanded={isOpen}
          title="Alt+A"
        >
          {isOpen ? (
            <X className="h-6 w-6 animate-spin" aria-hidden="true" />
          ) : (
            <Settings className="h-6 w-6 animate-pulse" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Panel del menú */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel deslizante */}
          <div
            className={`fixed bottom-0 right-0 top-0 w-[420px] max-w-[90vw] z-50 shadow-2xl animate-slideInRight overflow-hidden flex flex-col ${
              darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-menu-title"
          >
            {/* Header */}
            <div className={`px-6 py-5 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-700' : 'bg-emerald-600'}`}>
                    <Settings className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="accessibility-menu-title" className="text-xl font-bold">
                      Accesibilidad
                    </h2>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Personaliza tu experiencia
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                  aria-label="Cerrar menú"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setActiveTab('main')}
                onMouseEnter={() => handleSpeak('Configuración principal')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 ${
                  activeTab === 'main'
                    ? darkMode
                      ? 'bg-gray-800 text-emerald-400 border-b-2 border-emerald-400'
                      : 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600'
                    : darkMode
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Principal
              </button>
              <button
                onClick={() => setActiveTab('color')}
                onMouseEnter={() => handleSpeak('Configuración de color')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 ${
                  activeTab === 'color'
                    ? darkMode
                      ? 'bg-gray-800 text-emerald-400 border-b-2 border-emerald-400'
                      : 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600'
                    : darkMode
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Color
              </button>
              <button
                onClick={() => setActiveTab('shortcuts')}
                onMouseEnter={() => handleSpeak('Atajos de teclado')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 ${
                  activeTab === 'shortcuts'
                    ? darkMode
                      ? 'bg-gray-800 text-emerald-400 border-b-2 border-emerald-400'
                      : 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600'
                    : darkMode
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Keyboard className="h-4 w-4 inline-block mr-1" aria-hidden="true" />
                Atajos
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'main' && (
                <>
                  {/* Idioma */}
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                      <h3 className="font-semibold text-lg">Idioma</h3>
                      <kbd className={`ml-auto text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        Alt+L
                      </kbd>
                    </div>
                    <button
                      onClick={() => {
                        toggleLanguage();
                        handleSpeak(language === 'es' ? 'Cambiado a inglés' : 'Changed to Spanish');
                      }}
                      className={`w-full p-4 rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        darkMode
                          ? 'bg-gray-800 hover:bg-gray-700 active:bg-gray-600'
                          : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'
                      }`}
                      title="Alt+L"
                    >
                      <div className="flex items-center justify-between">
                        <span>{language === 'es' ? 'Español' : 'English'}</span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {language === 'es' ? '🇪🇸' : '🇬🇧'}
                        </span>
                      </div>
                    </button>
                  </section>

                  {/* Tamaño de fuente */}
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Type className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                      <h3 className="font-semibold text-lg">Tamaño de Fuente</h3>
                      <kbd className={`ml-auto text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        Alt+/-
                      </kbd>
                    </div>
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {fontSizeLabels[fontSize]}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              decreaseFontSize();
                              handleSpeak('Fuente más pequeña');
                            }}
                            disabled={fontSize === 'small'}
                            className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                              fontSize === 'small'
                                ? darkMode
                                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : darkMode
                                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                  : 'bg-white hover:bg-gray-100 text-gray-700'
                            }`}
                            aria-label="Disminuir tamaño de fuente (Alt+-)"
                            title="Alt+-"
                          >
                            <Minus className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => {
                              increaseFontSize();
                              handleSpeak('Fuente más grande');
                            }}
                            disabled={fontSize === 'extra-large'}
                            className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                              fontSize === 'extra-large'
                                ? darkMode
                                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : darkMode
                                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                  : 'bg-white hover:bg-gray-100 text-gray-700'
                            }`}
                            aria-label="Aumentar tamaño de fuente (Alt++)"
                            title="Alt++"
                          >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                            style={{
                              width: `${
                                fontSize === 'small' ? 25 : fontSize === 'normal' ? 50 : fontSize === 'large' ? 75 : 100
                              }%`,
                            }}
                            role="progressbar"
                            aria-valuenow={fontSize === 'small' ? 25 : fontSize === 'normal' ? 50 : fontSize === 'large' ? 75 : 100}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Modo oscuro */}
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      {darkMode ? (
                        <Moon className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                      ) : (
                        <Sun className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                      )}
                      <h3 className="font-semibold text-lg">Modo Oscuro</h3>
                      <kbd className={`ml-auto text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        Alt+D
                      </kbd>
                    </div>
                    <button
                      onClick={() => {
                        toggleDarkMode();
                        handleSpeak(darkMode ? 'Modo claro activado' : 'Modo oscuro activado');
                      }}
                      className={`w-full p-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        darkMode
                          ? 'bg-emerald-700 text-white hover:bg-emerald-600'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      title="Alt+D"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{darkMode ? 'Activado' : 'Desactivado'}</span>
                        <div
                          className={`relative w-14 h-7 rounded-full transition-colors ${
                            darkMode ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                              darkMode ? 'translate-x-7' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  </section>

                  {/* Lectura por voz */}
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      {speechEnabled ? (
                        <Volume2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                      ) : (
                        <VolumeX className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                      )}
                      <h3 className="font-semibold text-lg">Lectura por Voz</h3>
                      <kbd className={`ml-auto text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        Alt+V
                      </kbd>
                    </div>
                    <button
                      onClick={() => {
                        toggleSpeech();
                        if (!speechEnabled) {
                          setTimeout(() => speakText('Lectura por voz activada'), 100);
                        }
                      }}
                      className={`w-full p-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        speechEnabled
                          ? 'bg-emerald-700 text-white hover:bg-emerald-600'
                          : darkMode
                            ? 'bg-gray-800 hover:bg-gray-700'
                            : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      title="Alt+V"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{speechEnabled ? 'Activado' : 'Desactivado'}</span>
                        <div
                          className={`relative w-14 h-7 rounded-full transition-colors ${
                            speechEnabled ? 'bg-emerald-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                              speechEnabled ? 'translate-x-7' : 'translate-x-0'
                            } ${isSpeaking ? 'animate-pulse' : ''}`}
                          />
                        </div>
                      </div>
                    </button>
                    {speechEnabled && (
                      <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Pasa el cursor sobre los elementos para escuchar su contenido
                      </p>
                    )}
                  </section>
                </>
              )}

              {activeTab === 'shortcuts' && (
                <>
                  {/* Guía de atajos de teclado */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Keyboard className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                      <h3 className="font-semibold text-lg">Atajos de Teclado</h3>
                    </div>

                    <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="text-sm">
                          Usa estos atajos de teclado en cualquier momento para controlar la accesibilidad rápidamente.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { shortcut: shortcuts.TOGGLE_MENU.replace('Alt+', 'Alt + '), description: 'Abrir/Cerrar menú', icon: Settings },
                        { shortcut: shortcuts.TOGGLE_LANGUAGE.replace('Alt+', 'Alt + '), description: 'Cambiar idioma', icon: Globe },
                        { shortcut: 'Alt + +', description: 'Aumentar fuente', icon: Plus },
                        { shortcut: 'Alt + -', description: 'Disminuir fuente', icon: Minus },
                        { shortcut: shortcuts.TOGGLE_DARK_MODE.replace('Alt+', 'Alt + '), description: 'Modo oscuro', icon: darkMode ? Moon : Sun },
                        { shortcut: shortcuts.TOGGLE_SPEECH.replace('Alt+', 'Alt + '), description: 'Lectura por voz', icon: speechEnabled ? Volume2 : VolumeX },
                        { shortcut: shortcuts.RESET_ALL.replace('Alt+', 'Alt + '), description: 'Restablecer todo', icon: RotateCcw },
                        { shortcut: 'Esc', description: 'Cerrar menú', icon: X },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                          onMouseEnter={() => handleSpeak(`${item.description}, atajo ${item.shortcut}`)}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                            <span className="text-sm font-medium">{item.description}</span>
                          </div>
                          <kbd className={`px-3 py-1.5 text-xs font-mono rounded shadow-sm ${
                            darkMode ? 'bg-gray-700 text-gray-200 border border-gray-600' : 'bg-white text-gray-700 border border-gray-300'
                          }`}>
                            {item.shortcut}
                          </kbd>
                        </div>
                      ))}
                    </div>

                    {/* Tips adicionales */}
                    <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <h4 className={`font-semibold mb-2 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        💡 Consejos:
                      </h4>
                      <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-0.5">•</span>
                          <span>Todos los atajos usan la tecla <kbd className="px-1 py-0.5 bg-emerald-600 text-white rounded text-xs">Alt</kbd></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-0.5">•</span>
                          <span>Los atajos funcionan en cualquier página</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-0.5">•</span>
                          <span>Usa <kbd className="px-1 py-0.5 bg-gray-600 text-white rounded text-xs">Tab</kbd> para navegar con el teclado</span>
                        </li>
                      </ul>
                    </div>
                  </section>
                </>
              )}

              {activeTab === 'color' && (
                <>
                  {/* Filtros de daltonismo */}
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Palette className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                      <h3 className="font-semibold text-lg">Filtros de Color</h3>
                    </div>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Selecciona un filtro de color para personas con daltonismo
                    </p>
                    <div className="space-y-2">
                      {colorBlindModes.map((mode) => (
                        <button
                          key={mode.value}
                          onClick={() => {
                            setColorBlindnessMode(mode.value);
                            handleSpeak(`Filtro ${mode.label} activado`);
                          }}
                          onMouseEnter={() => handleSpeak(mode.label)}
                          className={`w-full p-4 rounded-xl transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            colorBlindnessMode === mode.value
                              ? 'bg-emerald-600 text-white shadow-lg scale-105'
                              : darkMode
                                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-semibold mb-1">{mode.label}</div>
                              <div
                                className={`text-xs ${
                                  colorBlindnessMode === mode.value
                                    ? 'text-emerald-100'
                                    : darkMode
                                      ? 'text-gray-400'
                                      : 'text-gray-500'
                                }`}
                              >
                                {mode.description}
                              </div>
                            </div>
                            {colorBlindnessMode === mode.value && (
                              <Check className="h-5 w-5 ml-3" aria-hidden="true" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Vista previa de colores */}
                    <div className={`mt-4 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Vista previa de colores:
                      </p>
                      <div className="flex gap-2">
                        <div className="flex-1 h-12 bg-red-500 rounded-lg shadow-sm" aria-label="Rojo" />
                        <div className="flex-1 h-12 bg-green-500 rounded-lg shadow-sm" aria-label="Verde" />
                        <div className="flex-1 h-12 bg-blue-500 rounded-lg shadow-sm" aria-label="Azul" />
                        <div className="flex-1 h-12 bg-yellow-500 rounded-lg shadow-sm" aria-label="Amarillo" />
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>

            {/* Footer con botón de reseteo */}
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <button
                onClick={() => {
                  resetAllSettings();
                  handleSpeak('Configuración restablecida');
                }}
                onMouseEnter={() => handleSpeak('Restablecer configuración. Atajo Alt más R')}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Alt+R"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Restablecer Configuración
                <kbd className={`ml-2 text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  Alt+R
                </kbd>
              </button>
            </div>
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

        /* Filtros de daltonismo */
        .protanopia {
          filter: url(#protanopia-filter);
        }
        
        .deuteranopia {
          filter: url(#deuteranopia-filter);
        }
        
        .tritanopia {
          filter: url(#tritanopia-filter);
        }
      `}</style>

      {/* SVG Filters para daltonismo */}
      <svg className="hidden">
        <defs>
          {/* Protanopia (sin rojo) */}
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="
              0.567, 0.433, 0.000, 0, 0
              0.558, 0.442, 0.000, 0, 0
              0.000, 0.242, 0.758, 0, 0
              0.000, 0.000, 0.000, 1, 0"/>
          </filter>
          
          {/* Deuteranopia (sin verde) */}
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="
              0.625, 0.375, 0.000, 0, 0
              0.700, 0.300, 0.000, 0, 0
              0.000, 0.300, 0.700, 0, 0
              0.000, 0.000, 0.000, 1, 0"/>
          </filter>
          
          {/* Tritanopia (sin azul) */}
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="
              0.950, 0.050, 0.000, 0, 0
              0.000, 0.433, 0.567, 0, 0
              0.000, 0.475, 0.525, 0, 0
              0.000, 0.000, 0.000, 1, 0"/>
          </filter>
        </defs>
      </svg>
    </>
  );
};

export default AccessibilityMenu;
