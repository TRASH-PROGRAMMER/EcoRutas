# 🌟 Menú de Accesibilidad - EcoRutas

## 📋 Descripción

EcoRutas incluye un completo menú de accesibilidad que permite a todos los usuarios personalizar su experiencia de navegación según sus necesidades específicas. Este menú está diseñado siguiendo las mejores prácticas de accesibilidad web (WCAG 2.1).

## ✨ Características

### 1. 🌐 Cambio de Idioma
- **Español ⇄ Inglés**: Alterna entre español e inglés con un solo clic
- Todos los elementos de la interfaz se traducen automáticamente
- La preferencia se guarda en el navegador

### 2. 📝 Tamaño de Fuente Ajustable
- **4 tamaños disponibles**:
  - Pequeña (87.5%)
  - Normal (100%)
  - Grande (112.5%)
  - Extra Grande (125%)
- Control preciso con botones + y -
- Indicador visual del tamaño actual
- Afecta toda la aplicación de forma consistente

### 3. 🎨 Filtros para Daltonismo
Filtros especializados para diferentes tipos de daltonismo:

- **Normal**: Sin filtro aplicado
- **Protanopía**: Para dificultad con el color rojo
- **Deuteranopía**: Para dificultad con el color verde
- **Tritanopía**: Para dificultad con el color azul

Incluye una vista previa de colores para verificar el filtro aplicado.

### 4. 🌙 Modo Oscuro
- Reduce el cansancio visual en ambientes con poca luz
- Cambia toda la paleta de colores de la aplicación
- Transiciones suaves entre modos
- Conserva la legibilidad y el contraste

### 5. 🔊 Lectura por Voz (Text-to-Speech)
- Lee automáticamente el contenido al pasar el cursor
- Utiliza la API Web Speech del navegador
- Se adapta al idioma seleccionado (español/inglés)
- Indicador visual cuando está hablando
- Control de activación/desactivación

### 6. 🔄 Restablecer Configuración
- Vuelve todas las opciones a sus valores predeterminados
- Un solo clic para resetear todo

## 🚀 Cómo Usar

### Abrir el Menú
1. Busca el **botón flotante verde con ícono de configuración** en la esquina inferior derecha
2. Haz clic para abrir el panel de accesibilidad
3. O presiona **`Alt + A`** en cualquier momento

### ⌨️ Atajos de Teclado

Todos los atajos de teclado usan la tecla `Alt` para acceso rápido:

| Atajo | Función |
|-------|---------|
| `Alt + A` | Abrir/Cerrar el menú de accesibilidad |
| `Alt + L` | Cambiar idioma (Español ⇄ Inglés) |
| `Alt + +` | Aumentar tamaño de fuente |
| `Alt + -` | Disminuir tamaño de fuente |
| `Alt + D` | Activar/Desactivar modo oscuro |
| `Alt + V` | Activar/Desactivar lectura por voz |
| `Alt + R` | Restablecer toda la configuración |
| `Esc` | Cerrar el menú (cuando está abierto) |

**Nota:** Los atajos funcionan en cualquier página de la aplicación.

### Navegación del Menú
El menú tiene **3 pestañas**:
- **Principal**: Idioma, fuente, modo oscuro y lectura por voz
- **Color**: Filtros de daltonismo y vista previa
- **Atajos**: Lista completa de atajos de teclado

### Cambiar Idioma
```
Menú de Accesibilidad > Principal > Idioma > Clic en el botón
O presiona Alt + L
```

### Ajustar Tamaño de Fuente
```
Menú de Accesibilidad > Principal > Tamaño de Fuente > Botones + / -
O presiona Alt + + para aumentar / Alt + - para disminuir
```

### Activar Filtro de Daltonismo
```
Menú de Accesibilidad > Color > Seleccionar tipo de filtro
```

### Activar Modo Oscuro
```
Menú de Accesibilidad > Principal > Modo Oscuro > Toggle
O presiona Alt + D
```

### Activar Lectura por Voz
```
Menú de Accesibilidad > Principal > Lectura por Voz > Toggle
O presiona Alt + V
Luego pasa el cursor sobre cualquier elemento
```

### Restablecer Todo
```
Menú de Accesibilidad > Botón inferior "Restablecer Configuración"
O presiona Alt + R
```

## 💾 Persistencia de Datos

Todas las configuraciones se guardan automáticamente en el **localStorage** del navegador:
- `eco-language`: Idioma seleccionado
- `eco-font-size`: Tamaño de fuente
- `eco-color-blindness`: Filtro de daltonismo
- `eco-dark-mode`: Estado del modo oscuro
- `eco-speech-enabled`: Estado de lectura por voz

Las preferencias se mantienen incluso después de cerrar el navegador.

## 🎯 Atajos de Teclado Recomendados

Para mejorar aún más la accesibilidad, todos los elementos son navegables con teclado:
- **Tab**: Navegar entre elementos
- **Shift + Tab**: Navegar hacia atrás
- **Enter/Espacio**: Activar botones
- **Esc**: Cerrar el menú (cuando está abierto)
- **Alt + [Letra]**: Atajos de accesibilidad (ver tabla arriba)

### 💡 Consejos para Atajos
- Todos los atajos de accesibilidad usan la tecla `Alt`
- Los atajos funcionan en cualquier página de la aplicación
- No es necesario abrir el menú para usar los atajos
- La configuración se guarda automáticamente
- Aparece un indicador visual al usar atajos

## 🛠️ Tecnologías Utilizadas

- **React Context API**: Gestión de estado global
- **Web Speech API**: Síntesis de voz
- **React i18next**: Internacionalización
- **CSS Filters**: Simulación de daltonismo
- **LocalStorage API**: Persistencia de preferencias
- **Tailwind CSS**: Estilos responsivos

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Lectura por Voz
La función de lectura por voz requiere:
- Navegadores modernos con soporte para Web Speech API
- Chrome/Edge tienen el mejor soporte
- Firefox tiene soporte limitado
- Safari requiere permisos adicionales

## 🎨 Personalización Técnica

### Agregar Nuevos Idiomas

Edita `src/i18n.ts`:
```typescript
const resources = {
  es: { translation: { ... } },
  en: { translation: { ... } },
  fr: { translation: { ... } }, // Nuevo idioma
};
```

### Agregar Nuevos Tamaños de Fuente

Edita `src/context/AccessibilityContext.tsx`:
```typescript
const FONT_SIZE_MAP: Record<FontSizeType, number> = {
  'small': 87.5,
  'normal': 100,
  'large': 112.5,
  'extra-large': 125,
  'huge': 150, // Nuevo tamaño
};
```

### Personalizar Colores del Modo Oscuro

Edita `src/index.css` en la sección `.dark`:
```css
.dark {
  --background: 150 25% 8%;
  --foreground: 45 20% 95%;
  /* Personaliza más variables... */
}
```

## ♿ Estándares de Accesibilidad

Este menú cumple con:
- **WCAG 2.1 Level AA**: Contraste, navegación por teclado, etiquetas ARIA
- **Section 508**: Compatibilidad con lectores de pantalla
- **Best Practices**: Semántica HTML5, roles ARIA adecuados

## 🐛 Solución de Problemas

### La lectura por voz no funciona
- Verifica que tu navegador soporte Web Speech API
- Comprueba los permisos del navegador
- Intenta con Chrome o Edge para mejor compatibilidad

### Los filtros de daltonismo no se aplican
- Refresca la página
- Verifica que los estilos CSS se carguen correctamente
- Comprueba la consola del navegador para errores

### Las preferencias no se guardan
- Verifica que el navegador permita localStorage
- Comprueba que no estés en modo incógnito
- Limpia la caché si es necesario

## 📞 Soporte

Para reportar problemas o sugerencias relacionadas con accesibilidad, por favor abre un issue en el repositorio del proyecto.

## 📄 Licencia

Este componente es parte del proyecto EcoRutas y está disponible bajo la misma licencia del proyecto principal.

---

**Desarrollado con ❤️ pensando en todos los usuarios**
