import Dexie, { Table } from 'dexie';

// 🖼️ Interfaz para imágenes almacenadas
export interface ImagenLocalidad {
  id: string;
  data: string; // Base64 o Blob convertido a string
  name: string;
  type: string;
}

// 🕒 Interfaz para horarios
export interface Horario {
  id: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

// 🧾 Interfaz para historial de cambios (ACTUALIZADA)
export interface HistorialCambio {
  id: string;
  localidadId: string; // 🔹 ID de la localidad a la que pertenece el cambio
  fecha: string;
  campoModificado?: string; // 🔹 Nombre del campo modificado
  valorAnterior?: any;
  valorNuevo?: any;
  usuario: string;
  accion: 'created' | 'updated' | 'published' | 'archived' | 'deleted';
}

// 📍 Interfaz principal de Localidad
export interface Localidad {
  id: string;
  nombre: string;
  pais: string;
  provincia: string;
  ciudad: string;
  tipo: string;
  categoria: string;
  descripcion: string;
  descripcionCorta: string;
  accesibilidad: string;
  ubicacion: string;
  coordenadas: string;
  altitud: string;
  clima: string;
  infraestructura: string;
  serviciosBasicos: string;
  serviciosTuristicos: string;
  capacidadMaxima: string;
  temporadaAlta: string;
  temporadaBaja: string;
  seguridad: string;
  medicinaEmergencia: string;
  comunicaciones: string;
  reportes: string;
  certificaciones: string;
  tarifas: string;
  idiomas: string[];
  contactoEmergencia: string;
  sitioWeb: string;
  redesSociales: string;
  precioPorPersona: number;
  imagenes: ImagenLocalidad[];
  horarios: Horario[];
  publicada: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  createdBy: string;
  historial: HistorialCambio[];
  status: 'draft' | 'published' | 'archived';
}

// 🗄️ Base de datos Dexie
class EcoRutasDatabase extends Dexie {
  localidades!: Table<Localidad, string>;
  historialCambios!: Table<HistorialCambio, string>; // 🔹 Nueva tabla para historial

  constructor() {
    super('ecorutasDB');
    
    // Definir el esquema (añadimos versión 2 para incluir historialCambios)
    this.version(2).stores({
      localidades: 'id, nombre, fechaCreacion, publicada, status',
      historialCambios: 'id, localidadId, fecha, accion, usuario' // 🔹 Nueva tabla
    });
  }
}

export const db = new EcoRutasDatabase();

// 🧩 Funciones helper para blobs e imágenes
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function base64ToBlob(base64: string): Blob {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// 🖼️ Obtener URL de imagen desde ImagenLocalidad
export function getImageUrl(imagen: ImagenLocalidad): string {
  if (imagen.data.startsWith('data:')) {
    return imagen.data; // Ya es base64 data URL
  }
  // Si es un string base64 sin prefijo, agregarlo
  if (imagen.data.startsWith('/9j/') || imagen.data.includes('iVBORw0KGgo')) {
    return `data:${imagen.type || 'image/jpeg'};base64,${imagen.data}`;
  }
  return imagen.data;
}
