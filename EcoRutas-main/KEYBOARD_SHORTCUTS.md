# ⌨️ Atajos de Teclado - EcoRutas

## Atajos de Accesibilidad

Todos los atajos de accesibilidad usan la tecla `Alt` para facilitar el acceso rápido:

### 🎯 Atajos Principales

| Combinación | Acción | Descripción |
|------------|--------|-------------|
| `Alt + A` | **Abrir/Cerrar Menú** | Abre o cierra el panel de accesibilidad |
| `Alt + L` | **Cambiar Idioma** | Alterna entre Español e Inglés |
| `Alt + +` | **Aumentar Fuente** | Incrementa el tamaño del texto |
| `Alt + -` | **Disminuir Fuente** | Reduce el tamaño del texto |
| `Alt + D` | **Modo Oscuro** | Activa/desactiva el tema oscuro |
| `Alt + V` | **Lectura por Voz** | Activa/desactiva text-to-speech |
| `Alt + R` | **Restablecer** | Vuelve toda la configuración a valores por defecto |
| `Esc` | **Cerrar** | Cierra el menú de accesibilidad (si está abierto) |

## 🚀 Navegación General

### Teclado

| Tecla | Acción |
|-------|--------|
| `Tab` | Navegar al siguiente elemento interactivo |
| `Shift + Tab` | Navegar al elemento anterior |
| `Enter` | Activar botón o enlace |
| `Espacio` | Activar botón o checkbox |
| `Esc` | Cerrar diálogos/menús |
| `←` `→` `↑` `↓` | Navegar en menús y listas |

## 💡 Características

### 🔔 Notificaciones Visuales
Al usar cualquier atajo de teclado, verás una notificación temporal en la esquina superior derecha que confirma la acción.

### 🎤 Confirmación por Voz
Si tienes activada la lectura por voz, escucharás una confirmación cuando uses los atajos.

### 💾 Guardado Automático
Todas las configuraciones se guardan automáticamente en tu navegador.

## 📱 Compatibilidad

### Desktop
- ✅ Windows: Atajos funcionan correctamente
- ✅ macOS: Usa `Option` en lugar de `Alt`
- ✅ Linux: Atajos funcionan correctamente

### Navegadores
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ Algunos navegadores pueden tener conflictos con atajos del sistema

## ⚠️ Resolución de Conflictos

### Si un atajo no funciona:

1. **Verifica conflictos del navegador:**
   - Algunas extensiones pueden usar los mismos atajos
   - Revisa las configuraciones de atajos de tu navegador

2. **Conflictos del sistema operativo:**
   - Windows: Algunos atajos `Alt` pueden estar reservados
   - macOS: `Option + [tecla]` puede generar caracteres especiales
   - Linux: Verifica la configuración de tu entorno de escritorio

3. **Alternativas:**
   - Siempre puedes usar el botón flotante verde
   - Haz clic en el menú para acceder a todas las funciones
   - Navega con `Tab` y `Enter`

## 🎨 Personalización para Desarrolladores

Si necesitas modificar los atajos, edita:

```typescript
// src/context/AccessibilityContext.tsx

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_MENU: 'Alt+A',      // Cambiar a tu preferencia
  TOGGLE_LANGUAGE: 'Alt+L',
  INCREASE_FONT: 'Alt++',
  DECREASE_FONT: 'Alt+-',
  TOGGLE_DARK_MODE: 'Alt+D',
  TOGGLE_SPEECH: 'Alt+V',
  RESET_ALL: 'Alt+R',
} as const;
```

Luego actualiza los event listeners correspondientes en el mismo archivo.

## 📚 Más Información

- [ACCESSIBILITY.md](./ACCESSIBILITY.md) - Guía completa de accesibilidad
- [ACCESSIBILITY_QUICKSTART.md](./ACCESSIBILITY_QUICKSTART.md) - Guía para desarrolladores

## 🐛 Reportar Problemas

Si encuentras problemas con los atajos de teclado:

1. Verifica la consola del navegador (F12)
2. Prueba en modo incógnito (sin extensiones)
3. Reporta el problema incluyendo:
   - Sistema operativo
   - Navegador y versión
   - Atajo específico que no funciona
   - Comportamiento esperado vs actual

## 🎯 Tips Rápidos

- 💡 **Hint visual:** Al abrir la app por primera vez, verás un hint flotante mostrando `Alt+A`
- 🔊 **Audio feedback:** Con lectura por voz activada, escucharás cada acción
- ⚡ **Rápido acceso:** No necesitas abrir el menú para usar los atajos
- 📋 **Lista completa:** Presiona `Alt+A` y ve a la pestaña "Atajos"

---

**Recuerda:** Todos los atajos están diseñados para mejorar tu experiencia sin interferir con la navegación normal. ¡Úsalos con confianza! 🚀
