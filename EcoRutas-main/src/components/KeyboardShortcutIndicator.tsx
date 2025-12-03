import React, { useState, useEffect } from 'react';
import { useAccessibility, KEYBOARD_SHORTCUTS } from '@/context/AccessibilityContext';
import { Keyboard, Check, X } from 'lucide-react';

/**
 * Componente que muestra notificaciones visuales cuando se usan atajos de teclado
 * Útil para dar feedback al usuario sobre las acciones realizadas
 */
const KeyboardShortcutIndicator: React.FC = () => {
  const { darkMode } = useAccessibility();
  const [lastShortcut, setLastShortcut] = useState<string | null>(null);
  const [action, setAction] = useState<string>('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey) return;

      let shortcutKey = '';
      let actionDescription = '';

      switch (e.key.toLowerCase()) {
        case 'a':
          shortcutKey = 'Alt+A';
          actionDescription = 'Menú de Accesibilidad';
          break;
        case 'l':
          shortcutKey = 'Alt+L';
          actionDescription = 'Cambiar Idioma';
          break;
        case '=':
        case '+':
          shortcutKey = 'Alt++';
          actionDescription = 'Aumentar Fuente';
          break;
        case '-':
          shortcutKey = 'Alt+-';
          actionDescription = 'Disminuir Fuente';
          break;
        case 'd':
          shortcutKey = 'Alt+D';
          actionDescription = 'Modo Oscuro';
          break;
        case 'v':
          shortcutKey = 'Alt+V';
          actionDescription = 'Lectura por Voz';
          break;
        case 'r':
          shortcutKey = 'Alt+R';
          actionDescription = 'Restablecer';
          break;
        default:
          return;
      }

      if (shortcutKey) {
        setLastShortcut(shortcutKey);
        setAction(actionDescription);
        setVisible(true);

        // Ocultar después de 2 segundos
        setTimeout(() => {
          setVisible(false);
        }, 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!visible || !lastShortcut) return null;

  return (
    <div
      className={`fixed top-20 right-6 z-50 animate-slideInRight ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      } shadow-2xl rounded-lg p-4 min-w-[280px] border-l-4 border-emerald-600`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
          <Keyboard className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <kbd
              className={`px-2 py-1 rounded text-xs font-mono ${
                darkMode ? 'bg-gray-700 text-emerald-400' : 'bg-gray-100 text-emerald-600'
              }`}
            >
              {lastShortcut}
            </kbd>
            <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          </div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {action}
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className={`flex-shrink-0 p-1 rounded transition-colors ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
          aria-label="Cerrar notificación"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default KeyboardShortcutIndicator;
