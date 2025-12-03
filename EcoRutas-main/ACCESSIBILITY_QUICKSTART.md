# 🚀 Guía Rápida de Implementación - Accesibilidad

## Para Desarrolladores

Esta guía te ayudará a integrar las características de accesibilidad en tus componentes.

## 📦 Importaciones Necesarias

```typescript
// Contexto de accesibilidad
import { useAccessibility, KEYBOARD_SHORTCUTS } from '@/context/AccessibilityContext';

// Hooks personalizados (recomendado)
import { 
  useAccessibilityFeatures,
  useAccessibleElement,
  useThemeClasses 
} from '@/hooks/useAccessibilityFeatures';
```

## ⌨️ Atajos de Teclado Integrados

El sistema incluye atajos de teclado globales que funcionan automáticamente:

```typescript
// Los atajos están disponibles en el contexto
const { shortcuts } = useAccessibility();

console.log(shortcuts.TOGGLE_MENU);     // "Alt+A"
console.log(shortcuts.TOGGLE_LANGUAGE); // "Alt+L"
console.log(shortcuts.INCREASE_FONT);   // "Alt++"
console.log(shortcuts.DECREASE_FONT);   // "Alt+-"
console.log(shortcuts.TOGGLE_DARK_MODE);// "Alt+D"
console.log(shortcuts.TOGGLE_SPEECH);   // "Alt+V"
console.log(shortcuts.RESET_ALL);       // "Alt+R"
```

**Nota:** No necesitas implementar nada, los atajos funcionan globalmente.

## 🎯 Uso Básico

### 1. Componente con Lectura por Voz

```typescript
import React from 'react';
import { useAccessibilityFeatures } from '@/hooks/useAccessibilityFeatures';

const MyComponent: React.FC = () => {
  const { createSpeakOnHover, getThemeColors } = useAccessibilityFeatures();
  const colors = getThemeColors();

  return (
    <button
      className={`px-4 py-2 rounded ${colors.primary} ${colors.primaryHover}`}
      onMouseEnter={createSpeakOnHover('Botón de acción principal')}
      onClick={() => console.log('Clicked')}
    >
      Hacer clic
    </button>
  );
};
```

### 2. Card Accesible

```typescript
import React from 'react';
import { useAccessibleElement, useThemeClasses } from '@/hooks/useAccessibilityFeatures';

const AccessibleCard: React.FC<{ title: string; content: string }> = ({ title, content }) => {
  const classes = useThemeClasses();
  const accessibleProps = useAccessibleElement(title, content);

  return (
    <div 
      className={`p-4 rounded-lg ${classes.card} ${classes.border} border`}
      {...accessibleProps}
    >
      <h3 className={classes.text.primary}>{title}</h3>
      <p className={classes.text.secondary}>{content}</p>
    </div>
  );
};
```

### 3. Formulario Accesible

```typescript
import React from 'react';
import { useAccessibilityFeatures } from '@/hooks/useAccessibilityFeatures';

const AccessibleForm: React.FC = () => {
  const { announce, getThemeColors } = useAccessibilityFeatures();
  const colors = getThemeColors();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    announce('Formulario enviado correctamente', 'assertive');
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${colors.background}`}>
      <div>
        <label htmlFor="name" className={colors.text}>
          Nombre
        </label>
        <input
          id="name"
          type="text"
          className={`w-full px-3 py-2 rounded ${colors.card} ${colors.border} border`}
          aria-required="true"
        />
      </div>
      <button 
        type="submit"
        className={`px-6 py-2 rounded ${colors.primary} ${colors.primaryHover}`}
      >
        Enviar
      </button>
    </form>
  );
};
```

## 🎨 Estilos Responsivos al Tema

### Método 1: Usar Hook useThemeClasses

```typescript
const { container, card, text, button } = useThemeClasses();

return (
  <div className={container}>
    <div className={card}>
      <h2 className={text.primary}>Título</h2>
      <p className={text.secondary}>Descripción</p>
      <button className={button.primary}>Acción</button>
    </div>
  </div>
);
```

### Método 2: Usar themeClass Helper

```typescript
const { themeClass } = useAccessibilityFeatures();

return (
  <div className={themeClass('bg-white text-gray-900', 'bg-gray-900 text-white')}>
    Contenido
  </div>
);
```

### Método 3: Usar darkMode directamente

```typescript
const { darkMode } = useAccessibility();

return (
  <div className={darkMode ? 'dark-styles' : 'light-styles'}>
    Contenido
  </div>
);
```

## 🔊 Lectura por Voz

### Leer al Pasar el Cursor

```typescript
const { createSpeakOnHover } = useAccessibilityFeatures();

<div onMouseEnter={createSpeakOnHover('Texto a leer')}>
  Contenido
</div>
```

### Anunciar Notificaciones

```typescript
const { announce } = useAccessibilityFeatures();

// Anuncio normal (polite)
announce('Cambios guardados correctamente');

// Anuncio urgente (assertive)
announce('Error al guardar, intenta de nuevo', 'assertive');
```

### Leer Manualmente

```typescript
const { speakText, stopSpeaking } = useAccessibility();

// Iniciar lectura
speakText('Texto a leer');

// Detener lectura
stopSpeaking();
```

## 🌐 Internacionalización

### Obtener Idioma Actual

```typescript
const { language, getCurrentLanguageName } = useAccessibilityFeatures();

console.log(language); // 'es' | 'en'
console.log(getCurrentLanguageName()); // 'Español' | 'English'
```

### Cambiar Idioma

```typescript
const { toggleLanguage } = useAccessibility();

<button onClick={toggleLanguage}>
  Cambiar idioma
</button>
```

## 📏 Tamaño de Fuente

### Verificar Tamaño Grande

```typescript
const { isLargeFontSize, getFontSizeMultiplier } = useAccessibilityFeatures();

if (isLargeFontSize()) {
  // Ajustar espaciado para fuentes grandes
}

const multiplier = getFontSizeMultiplier(); // 0.875 - 1.25
```

## 🎨 Filtros de Color

### Verificar Filtro Activo

```typescript
const { hasColorBlindnessFilter, colorBlindnessMode } = useAccessibilityFeatures();

if (hasColorBlindnessFilter()) {
  console.log(`Filtro activo: ${colorBlindnessMode}`);
}
```

### Cambiar Filtro

```typescript
const { setColorBlindnessMode } = useAccessibility();

<button onClick={() => setColorBlindnessMode('protanopia')}>
  Activar Protanopía
</button>
```

## 🌙 Modo Oscuro

### Toggle Simple

```typescript
const { darkMode, toggleDarkMode } = useAccessibility();

<button onClick={toggleDarkMode}>
  {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
</button>
```

## 🔄 Restablecer Todo

```typescript
const { resetAllSettings } = useAccessibility();

<button onClick={resetAllSettings}>
  Restablecer configuración
</button>
```

## ✅ Props Accesibles Completos

```typescript
const { getAccessibleProps } = useAccessibilityFeatures();

<button {...getAccessibleProps('Guardar cambios', 'Guarda todos los cambios realizados')}>
  Guardar
</button>

// Genera:
// aria-label="Guardar cambios"
// aria-description="Guarda todos los cambios realizados"
// onMouseEnter={handler}
// onFocus={handler}
```

## 🎯 Ejemplo Completo

```typescript
import React, { useState } from 'react';
import { 
  useAccessibilityFeatures,
  useThemeClasses,
  useAccessibleElement 
} from '@/hooks/useAccessibilityFeatures';

const CompleteExample: React.FC = () => {
  const [count, setCount] = useState(0);
  const { announce, createSpeakOnHover } = useAccessibilityFeatures();
  const classes = useThemeClasses();
  const titleProps = useAccessibleElement('Contador de clics', 'Muestra el número de veces que has hecho clic');

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    announce(`Contador actualizado a ${newCount}`);
  };

  return (
    <div className={`p-6 rounded-xl ${classes.container}`}>
      <h2 className={`text-2xl font-bold mb-4 ${classes.text.primary}`} {...titleProps}>
        Contador: {count}
      </h2>
      
      <div className="flex gap-4">
        <button
          onClick={handleIncrement}
          onMouseEnter={createSpeakOnHover('Incrementar contador')}
          className={`px-6 py-3 rounded-lg ${classes.button.primary}`}
        >
          Incrementar
        </button>
        
        <button
          onClick={() => {
            setCount(0);
            announce('Contador restablecido');
          }}
          onMouseEnter={createSpeakOnHover('Restablecer contador')}
          className={`px-6 py-3 rounded-lg ${classes.button.secondary}`}
        >
          Restablecer
        </button>
      </div>
    </div>
  );
};

export default CompleteExample;
```

## 🐛 Debugging

### Verificar Estado de Accesibilidad

```typescript
const accessibility = useAccessibility();

console.log('Estado de Accesibilidad:', {
  idioma: accessibility.language,
  tamañoFuente: accessibility.fontSize,
  modoOscuro: accessibility.darkMode,
  vozHabilitada: accessibility.speechEnabled,
  filtroDaltonismo: accessibility.colorBlindnessMode,
  hablando: accessibility.isSpeaking,
});
```

## 📚 Recursos Adicionales

- [ACCESSIBILITY.md](./ACCESSIBILITY.md) - Documentación completa para usuarios
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)

## 💡 Mejores Prácticas

1. **Siempre proporciona aria-label** para elementos interactivos sin texto visible
2. **Usa semantic HTML** (`<button>`, `<nav>`, `<main>`, etc.)
3. **Prueba con lectores de pantalla** (NVDA, JAWS, VoiceOver)
4. **Mantén ratios de contraste adecuados** (mínimo 4.5:1 para texto normal)
5. **Asegura navegación por teclado** (Tab, Enter, Escape)
6. **Proporciona feedback visual y auditivo** para acciones importantes
7. **Usa focus-visible** para indicadores de foco
8. **Evita sólo depender del color** para transmitir información
9. **Prueba los atajos de teclado** (Alt + [Letra])
10. **Verifica que los tooltips muestren atajos** en botones importantes

## ⌨️ Agregar Atajos Personalizados

Si necesitas agregar atajos adicionales específicos de tu componente:

```typescript
import { useEffect } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';

const MyComponent = () => {
  const { speakText } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + S: Guardar (ejemplo)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
        speakText('Guardado');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ... resto del componente
};
```

**Recomendación:** Usa `Ctrl` o `Shift` para atajos específicos, `Alt` está reservado para accesibilidad global.

## 🎨 Paleta de Colores Accesible

```typescript
// Colores base con buen contraste
const accessibleColors = {
  // Modo claro
  light: {
    background: '#FFFFFF',
    text: '#1F2937',        // Gray-800
    primary: '#059669',     // Emerald-600
    secondary: '#6B7280',   // Gray-500
    error: '#DC2626',       // Red-600
    success: '#10B981',     // Emerald-500
  },
  // Modo oscuro
  dark: {
    background: '#111827',  // Gray-900
    text: '#F9FAFB',        // Gray-50
    primary: '#34D399',     // Emerald-400
    secondary: '#9CA3AF',   // Gray-400
    error: '#EF4444',       // Red-500
    success: '#10B981',     // Emerald-500
  },
};
```

---

**¿Preguntas?** Consulta la documentación completa o abre un issue en el repositorio.
