// Utilidades para manejo de localidades en localStorage
export interface LocalidadData {
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
  // Metadatos
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: 'draft' | 'published' | 'archived';
}

const LOCALIDADES_KEY = 'ecorutas_localidades';
const LOCALIDAD_DRAFT_PREFIX = 'localidad_draft_';

// Función para obtener todas las localidades
export const getAllLocalidades = (): LocalidadData[] => {
  try {
    const data = localStorage.getItem(LOCALIDADES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading localidades:', error);
    return [];
  }
};

// Función para guardar una localidad
export const saveLocalidad = (localidad: Omit<LocalidadData, 'createdAt' | 'updatedAt'>): LocalidadData => {
  try {
    const localidades = getAllLocalidades();
    const now = new Date().toISOString();
    
    const newLocalidad: LocalidadData = {
      ...localidad,
      createdAt: localidad.id ? localidades.find(l => l.id === localidad.id)?.createdAt || now : now,
      updatedAt: now,
    };

    // Si existe, actualizar; si no, agregar
    const existingIndex = localidades.findIndex(l => l.id === localidad.id);
    if (existingIndex >= 0) {
      localidades[existingIndex] = newLocalidad;
    } else {
      localidades.unshift(newLocalidad); // Agregar al inicio
    }

    localStorage.setItem(LOCALIDADES_KEY, JSON.stringify(localidades));
    
    // Limpiar borrador si existe
    localStorage.removeItem(`${LOCALIDAD_DRAFT_PREFIX}${localidad.id}`);
    
    return newLocalidad;
  } catch (error) {
    console.error('Error saving localidad:', error);
    throw new Error('No se pudo guardar la localidad');
  }
};

// Función para obtener una localidad por ID
export const getLocalidadById = (id: string): LocalidadData | null => {
  try {
    const localidades = getAllLocalidades();
    return localidades.find(l => l.id === id) || null;
  } catch (error) {
    console.error('Error loading localidad:', error);
    return null;
  }
};

// Función para eliminar una localidad
export const deleteLocalidad = (id: string): boolean => {
  try {
    const localidades = getAllLocalidades();
    const filteredLocalidades = localidades.filter(l => l.id !== id);
    
    if (filteredLocalidades.length === localidades.length) {
      return false; // No se encontró la localidad
    }
    
    localStorage.setItem(LOCALIDADES_KEY, JSON.stringify(filteredLocalidades));
    
    // Limpiar borrador asociado
    localStorage.removeItem(`${LOCALIDAD_DRAFT_PREFIX}${id}`);
    
    return true;
  } catch (error) {
    console.error('Error deleting localidad:', error);
    return false;
  }
};

// Función para duplicar una localidad
export const duplicateLocalidad = (id: string): LocalidadData | null => {
  try {
    const original = getLocalidadById(id);
    if (!original) return null;

    const newId = `localidad-${Date.now()}`;
    const duplicated = {
      ...original,
      id: newId,
      nombre: `${original.nombre} (Copia)`,
      status: 'draft' as const,
    };

    return saveLocalidad(duplicated);
  } catch (error) {
    console.error('Error duplicating localidad:', error);
    return null;
  }
};

// Función para cambiar el estado de una localidad
export const updateLocalidadStatus = (id: string, status: LocalidadData['status']): boolean => {
  try {
    const localidades = getAllLocalidades();
    const localidadIndex = localidades.findIndex(l => l.id === id);
    
    if (localidadIndex === -1) return false;
    
    localidades[localidadIndex] = {
      ...localidades[localidadIndex],
      status,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(LOCALIDADES_KEY, JSON.stringify(localidades));
    return true;
  } catch (error) {
    console.error('Error updating localidad status:', error);
    return false;
  }
};

// Función para filtrar localidades
export const filterLocalidades = (
  localidades: LocalidadData[],
  filters: {
    search?: string;
    tipo?: string;
    categoria?: string;
    status?: string;
    pais?: string;
  }
): LocalidadData[] => {
  let filtered = [...localidades];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(l => 
      l.nombre.toLowerCase().includes(searchLower) ||
      l.ciudad.toLowerCase().includes(searchLower) ||
      l.provincia.toLowerCase().includes(searchLower) ||
      l.descripcionCorta.toLowerCase().includes(searchLower)
    );
  }

  if (filters.tipo) {
    filtered = filtered.filter(l => l.tipo === filters.tipo);
  }

  if (filters.categoria) {
    filtered = filtered.filter(l => l.categoria === filters.categoria);
  }

  if (filters.status) {
    filtered = filtered.filter(l => l.status === filters.status);
  }

  if (filters.pais) {
    filtered = filtered.filter(l => l.pais === filters.pais);
  }

  return filtered;
};

// Función para exportar localidades a CSV
export const exportLocalidadesToCSV = (localidades: LocalidadData[]): string => {
  const headers = [
    'ID', 'Nombre', 'País', 'Provincia', 'Ciudad', 'Tipo', 'Categoría', 
    'Capacidad Máxima', 'Temporada Alta', 'Estado', 'Creado', 'Actualizado'
  ];

  const rows = localidades.map(l => [
    l.id,
    l.nombre,
    l.pais,
    l.provincia,
    l.ciudad,
    l.tipo,
    l.categoria,
    l.capacidadMaxima,
    l.temporadaAlta,
    l.status,
    new Date(l.createdAt).toLocaleDateString(),
    new Date(l.updatedAt).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csvContent;
};

// Función para obtener estadísticas
export const getLocalidadesStats = (localidades: LocalidadData[]) => {
  const total = localidades.length;
  const published = localidades.filter(l => l.status === 'published').length;
  const drafts = localidades.filter(l => l.status === 'draft').length;
  const archived = localidades.filter(l => l.status === 'archived').length;

  const tiposCounts = localidades.reduce((acc, l) => {
    acc[l.tipo] = (acc[l.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoriasCounts = localidades.reduce((acc, l) => {
    acc[l.categoria] = (acc[l.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    published,
    drafts,
    archived,
    tiposCounts,
    categoriasCounts,
  };
};
