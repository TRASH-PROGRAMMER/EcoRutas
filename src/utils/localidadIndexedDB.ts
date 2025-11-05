import { db, Localidad, ImagenLocalidad, HistorialCambio, blobToBase64, getImageUrl } from './db';

// Conversión de formato antiguo (localStorage) a nuevo (IndexedDB)
export interface LocalidadDataOld {
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
  imagenes: string[]; // Array de URLs o base64
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: 'draft' | 'published' | 'archived';
}

// Convertir formato antiguo a nuevo
function convertOldToNew(oldData: LocalidadDataOld): Localidad {
  const imagenes: ImagenLocalidad[] = (oldData.imagenes || []).map((img, index) => ({
    id: crypto.randomUUID(),
    data: img,
    name: `imagen-${index + 1}`,
    type: img.startsWith('data:') 
      ? img.match(/data:(.*?);/)?.[1] || 'image/jpeg'
      : 'image/jpeg'
  }));

  return {
    id: oldData.id,
    nombre: oldData.nombre || '',
    pais: oldData.pais || '',
    provincia: oldData.provincia || '',
    ciudad: oldData.ciudad || '',
    tipo: oldData.tipo || '',
    categoria: oldData.categoria || '',
    descripcion: oldData.descripcion || '',
    descripcionCorta: oldData.descripcionCorta || '',
    accesibilidad: oldData.accesibilidad || '',
    ubicacion: oldData.ubicacion || '',
    coordenadas: oldData.coordenadas || '',
    altitud: oldData.altitud || '',
    clima: oldData.clima || '',
    infraestructura: oldData.infraestructura || '',
    serviciosBasicos: oldData.serviciosBasicos || '',
    serviciosTuristicos: oldData.serviciosTuristicos || '',
    capacidadMaxima: oldData.capacidadMaxima || '',
    temporadaAlta: oldData.temporadaAlta || '',
    temporadaBaja: oldData.temporadaBaja || '',
    seguridad: oldData.seguridad || '',
    medicinaEmergencia: oldData.medicinaEmergencia || '',
    comunicaciones: oldData.comunicaciones || '',
    reportes: oldData.reportes || '',
    certificaciones: oldData.certificaciones || '',
    tarifas: oldData.tarifas || '',
    idiomas: oldData.idiomas || [],
    contactoEmergencia: oldData.contactoEmergencia || '',
    sitioWeb: oldData.sitioWeb || '',
    redesSociales: oldData.redesSociales || '',
    precioPorPersona: oldData.precioPorPersona || 0,
    imagenes,
    horarios: [],
    publicada: oldData.status === 'published',
    fechaCreacion: oldData.createdAt || new Date().toISOString(),
    fechaActualizacion: oldData.updatedAt || new Date().toISOString(),
    createdBy: oldData.createdBy || 'Admin',
    historial: [],
    status: oldData.status || 'draft'
  };
}

// Migrar datos de localStorage a IndexedDB (una sola vez)
export async function migrateLocalStorageToIndexedDB(): Promise<void> {
  try {
    const existingCount = await db.localidades.count();
    if (existingCount > 0) {
      // Ya hay datos en IndexedDB, no migrar
      return;
    }

    // Intentar leer de localStorage
    const localStorageData = localStorage.getItem('ecorutas_localidades');
    if (!localStorageData) {
      return; // No hay datos antiguos
    }

    const oldLocalidades: LocalidadDataOld[] = JSON.parse(localStorageData);
    if (oldLocalidades.length === 0) {
      return;
    }

    // Convertir y guardar en IndexedDB
    const nuevasLocalidades = oldLocalidades.map(convertOldToNew);
    await db.localidades.bulkAdd(nuevasLocalidades);

    console.log(`Migradas ${nuevasLocalidades.length} localidades de localStorage a IndexedDB`);
  } catch (error) {
    console.error('Error migrando datos:', error);
    // No fallar si hay error, simplemente continuar
  }
}

// Obtener todas las localidades
export async function getAllLocalidades(): Promise<Localidad[]> {
  try {
    await migrateLocalStorageToIndexedDB(); // Migrar si es necesario
    return await db.localidades.toArray();
  } catch (error) {
    console.error('Error obteniendo localidades:', error);
    return [];
  }
}

// Obtener localidad por ID
export async function getLocalidadById(id: string): Promise<Localidad | null> {
  try {
    return await db.localidades.get(id) || null;
  } catch (error) {
    console.error('Error obteniendo localidad:', error);
    return null;
  }
}

// Guardar localidad (crear o actualizar)
export async function saveLocalidad(localidad: Partial<Localidad>): Promise<Localidad> {
  try {
    if (!localidad.id) {
      throw new Error('ID de localidad requerido');
    }

    const ahora = new Date().toISOString();
    const existe = await db.localidades.get(localidad.id);

    let localidadCompleta: Localidad;

    if (existe) {
      // Actualizar
      localidadCompleta = {
        ...existe,
        ...localidad,
        fechaActualizacion: ahora,
      };
      await db.localidades.put(localidadCompleta);
    } else {
      // Crear nueva
      localidadCompleta = {
        id: localidad.id,
        nombre: localidad.nombre || '',
        pais: localidad.pais || '',
        provincia: localidad.provincia || '',
        ciudad: localidad.ciudad || '',
        tipo: localidad.tipo || '',
        categoria: localidad.categoria || '',
        descripcion: localidad.descripcion || '',
        descripcionCorta: localidad.descripcionCorta || '',
        accesibilidad: localidad.accesibilidad || '',
        ubicacion: localidad.ubicacion || '',
        coordenadas: localidad.coordenadas || '',
        altitud: localidad.altitud || '',
        clima: localidad.clima || '',
        infraestructura: localidad.infraestructura || '',
        serviciosBasicos: localidad.serviciosBasicos || '',
        serviciosTuristicos: localidad.serviciosTuristicos || '',
        capacidadMaxima: localidad.capacidadMaxima || '',
        temporadaAlta: localidad.temporadaAlta || '',
        temporadaBaja: localidad.temporadaBaja || '',
        seguridad: localidad.seguridad || '',
        medicinaEmergencia: localidad.medicinaEmergencia || '',
        comunicaciones: localidad.comunicaciones || '',
        reportes: localidad.reportes || '',
        certificaciones: localidad.certificaciones || '',
        tarifas: localidad.tarifas || '',
        idiomas: localidad.idiomas || [],
        contactoEmergencia: localidad.contactoEmergencia || '',
        sitioWeb: localidad.sitioWeb || '',
        redesSociales: localidad.redesSociales || '',
        precioPorPersona: localidad.precioPorPersona || 0,
        imagenes: localidad.imagenes || [],
        horarios: localidad.horarios || [],
        publicada: localidad.publicada || false,
        fechaCreacion: ahora,
        fechaActualizacion: ahora,
        createdBy: localidad.createdBy || 'Admin',
        historial: localidad.historial || [],
        status: localidad.status || 'draft'
      };
      await db.localidades.add(localidadCompleta);
    }

    return localidadCompleta;
  } catch (error) {
    console.error('Error guardando localidad:', error);
    throw error;
  }
}

// Eliminar localidad
export async function deleteLocalidad(id: string): Promise<boolean> {
  try {
    await db.localidades.delete(id);
    return true;
  } catch (error) {
    console.error('Error eliminando localidad:', error);
    return false;
  }
}

// Actualizar estado de publicación
export async function updateLocalidadStatus(
  id: string,
  status: 'draft' | 'published' | 'archived',
  usuario?: string
): Promise<boolean> {
  try {
    const localidad = await db.localidades.get(id);
    if (!localidad) {
      return false;
    }

    const statusAnterior = localidad.status;
    
    await db.localidades.update(id, {
      status,
      publicada: status === 'published',
      fechaActualizacion: new Date().toISOString()
    });

    // Registrar cambio en historial si cambió
    if (statusAnterior !== status && usuario) {
      await agregarCambioHistorial(id, {
        campo: 'status',
        valorAnterior: statusAnterior,
        valorNuevo: status,
        usuario,
        accion: status === 'published' ? 'published' : 'updated'
      });
    }

    return true;
  } catch (error) {
    console.error('Error actualizando estado:', error);
    return false;
  }
}

// Agregar cambio al historial
export async function agregarCambioHistorial(
  localidadId: string,
  cambio: {
    campo: string;
    valorAnterior: any;
    valorNuevo: any;
    usuario: string;
    accion: HistorialCambio['accion'];
  }
): Promise<void> {
  try {
    const localidad = await db.localidades.get(localidadId);
    if (!localidad) {
      return;
    }

    const nuevoCambio: HistorialCambio = {
      id: crypto.randomUUID(),
      localidadId: localidadId, // 🔹 ID de la localidad
      fecha: new Date().toISOString(),
      campoModificado: cambio.campo, // 🔹 Corregido: usar campoModificado en lugar de campo
      valorAnterior: cambio.valorAnterior,
      valorNuevo: cambio.valorNuevo,
      usuario: cambio.usuario,
      accion: cambio.accion
    };

    const historialActualizado = [nuevoCambio, ...(localidad.historial || [])];

    await db.localidades.update(localidadId, {
      historial: historialActualizado,
      fechaActualizacion: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error agregando cambio al historial:', error);
  }
}

// Comparar y registrar cambios
export async function registrarCambiosDesdeComparacion(
  localidadId: string,
  datosAnteriores: Partial<Localidad>,
  datosNuevos: Partial<Localidad>,
  usuario: string
): Promise<void> {
  const camposAComparar: (keyof Localidad)[] = [
    'nombre', 'pais', 'provincia', 'ciudad', 'tipo', 'categoria',
    'descripcion', 'descripcionCorta', 'accesibilidad', 'ubicacion',
    'coordenadas', 'altitud', 'clima', 'infraestructura', 'serviciosBasicos',
    'serviciosTuristicos', 'capacidadMaxima', 'temporadaAlta', 'temporadaBaja',
    'seguridad', 'medicinaEmergencia', 'comunicaciones', 'reportes',
    'certificaciones', 'tarifas', 'idiomas', 'contactoEmergencia',
    'sitioWeb', 'redesSociales', 'precioPorPersona', 'status'
  ];

  for (const campo of camposAComparar) {
    const valorAnterior = datosAnteriores[campo];
    const valorNuevo = datosNuevos[campo];

    const valorAnteriorNormalizado = valorAnterior === undefined || valorAnterior === null ? '' : valorAnterior;
    const valorNuevoNormalizado = valorNuevo === undefined || valorNuevo === null ? '' : valorNuevo;

    if (Array.isArray(valorAnteriorNormalizado) && Array.isArray(valorNuevoNormalizado)) {
      if (JSON.stringify(valorAnteriorNormalizado) !== JSON.stringify(valorNuevoNormalizado)) {
        await agregarCambioHistorial(localidadId, {
          campo: String(campo),
          valorAnterior: valorAnteriorNormalizado,
          valorNuevo: valorNuevoNormalizado,
          usuario,
          accion: 'updated'
        });
      }
    } else if (valorAnteriorNormalizado !== valorNuevoNormalizado) {
      const valorAnteriorStr = typeof valorAnteriorNormalizado === 'string' 
        ? valorAnteriorNormalizado 
        : String(valorAnteriorNormalizado || '');
      const valorNuevoStr = typeof valorNuevoNormalizado === 'string' 
        ? valorNuevoNormalizado 
        : String(valorNuevoNormalizado || '');
      
      await agregarCambioHistorial(localidadId, {
        campo: String(campo),
        valorAnterior: valorAnteriorStr,
        valorNuevo: valorNuevoStr,
        usuario,
        accion: 'updated'
      });
    }
  }
}

// Obtener localidades publicadas
export async function getLocalidadesPublicadas(): Promise<Localidad[]> {
  try {
    return await db.localidades
      .where('status')
      .equals('published')
      .toArray();
  } catch (error) {
    console.error('Error obteniendo localidades publicadas:', error);
    return [];
  }
}

// Obtener historial de localidad
export async function obtenerHistorialLocalidad(localidadId: string): Promise<HistorialCambio[]> {
  try {
    const localidad = await db.localidades.get(localidadId);
    return localidad?.historial || [];
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    return [];
  }
}

// Convertir File a ImagenLocalidad
export async function fileToImagenLocalidad(file: File): Promise<ImagenLocalidad> {
  const base64 = await blobToBase64(file);
  return {
    id: crypto.randomUUID(),
    data: base64,
    name: file.name,
    type: file.type || 'image/jpeg'
  };
}

// Función para obtener URLs de imágenes para mostrar
export function getImageUrls(localidad: Localidad): string[] {
  return localidad.imagenes.map(imagen => getImageUrl(imagen));
}