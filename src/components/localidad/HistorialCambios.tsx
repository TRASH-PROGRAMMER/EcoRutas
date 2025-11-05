import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ArrowLeft, Clock, User, FileEdit, Plus, Eye } from "lucide-react";
import { obtenerHistorialLocalidad } from "@/utils/localidadIndexedDB";
import { getLocalidadById } from "@/utils/localidadIndexedDB";
import { HistorialCambio } from "@/utils/db";

const getActionIcon = (accion: string) => {
  switch (accion) {
    case 'created': return <Plus className="w-4 h-4" />;
    case 'updated': return <FileEdit className="w-4 h-4" />;
    case 'published': return <Eye className="w-4 h-4" />;
    default: return <FileEdit className="w-4 h-4" />;
  }
};

const getActionColor = (accion: string) => {
  switch (accion) {
    case 'created': return 'bg-green-100 text-green-800';
    case 'updated': return 'bg-blue-100 text-blue-800';
    case 'published': return 'bg-purple-100 text-purple-800';
    case 'archived': return 'bg-gray-100 text-gray-800';
    case 'deleted': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatValue = (value: string | number | string[]): string => {
  // Si es array directamente, formatearlo
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : 'Vacío';
  }
  
  // Si es string, intentar parsear JSON
  if (typeof value === 'string') {
    // Si está vacío o es string vacío
    if (!value || value.trim() === '') {
      return 'Vacío';
    }
    
    try {
      // Intentar parsear si es JSON
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.length > 0 ? parsed.join(', ') : 'Vacío';
      }
      return String(parsed);
    } catch {
      // No es JSON, devolver el string directamente
      return value;
    }
  }
  
  // Si es número u otro tipo
  if (typeof value === 'number') {
    return String(value);
  }
  
  return 'Vacío';
};


export interface HistEntry {
  ts: string; // timestamp de la acción
  user: { id: string; name: string } | null;
  action: string; // descripción corta o acción realizada
  detail?: string; // detalle adicional (JSON u otro texto)
}


export default function HistorialCambios({ maxItems = 200 }: { maxItems?: number }) {
  const { localidadId } = useParams<{ localidadId: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<HistorialCambio[]>([]);
  const [localidadNombre, setLocalidadNombre] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistorial = async () => {
      if (localidadId) {
        setIsLoading(true);
        try {
          // Obtener historial
          const historial = await obtenerHistorialLocalidad(localidadId);
          setItems(historial);
          
          // Obtener nombre de la localidad
          const localidad = await getLocalidadById(localidadId);
          if (localidad) {
            setLocalidadNombre(localidad.nombre);
          }
        } catch (error) {
          console.error('Error cargando historial:', error);
          setItems([]);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadHistorial();
  }, [localidadId]);

  const clearAll = () => {
    if (!localidadId) return;
    if (!confirm("¿Borrar historial completo? Esta acción no se puede deshacer.")) return;
    
    // Limpiar del historial general
    try {
      const historialGlobal: HistorialCambio[] = JSON.parse(localStorage.getItem('ecorutas_historial_cambios') || '[]');
      const historialFiltrado = historialGlobal.filter(h => h.localidadId !== localidadId);
      localStorage.setItem('ecorutas_historial_cambios', JSON.stringify(historialFiltrado));
      setItems([]);
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  if (!localidadId) {
    return <Alert><AlertDescription>ID de localidad no encontrado.</AlertDescription></Alert>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-yellow-700">
            Historial de Cambios
          </h1>
          <p className="text-gray-600 text-sm">
            {localidadNombre ? `Localidad: ${localidadNombre}` : `ID: ${localidadId}`}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/dashboard/admin")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de cambios</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <Alert>
              <AlertDescription>No hay registros de cambios aún.</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-4 max-h-[600px] overflow-auto">
                {items.slice(0, maxItems).map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={getActionColor(item.accion)}>
                          <span className="flex items-center gap-1">
                            {getActionIcon(item.accion)}
                            {item.accion === 'created' ? 'Creado' :
                             item.accion === 'updated' ? 'Actualizado' :
                             item.accion === 'published' ? 'Publicado' :
                             item.accion === 'archived' ? 'Archivado' :
                             item.accion === 'deleted' ? 'Eliminado' : item.accion}
                          </span>
                        </Badge>
                        <span className="font-semibold text-gray-700">{item.campoModificado}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(item.fecha).toLocaleString('es-ES')}
                      </div>
                    </div>
                    
                    {item.accion === 'created' ? (
                      <div className="bg-blue-50 p-3 rounded text-sm text-gray-700">
                        <span className="font-medium">Localidad creada inicialmente</span>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="font-medium text-gray-600 mb-1">Valor anterior:</div>
                          <div className="bg-gray-50 p-2 rounded text-gray-700 break-words min-h-[40px]">
                            {formatValue(item.valorAnterior)}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-600 mb-1">Valor nuevo:</div>
                          <div className="bg-green-50 p-2 rounded text-gray-700 break-words min-h-[40px]">
                            {formatValue(item.valorNuevo)}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <User className="w-3 h-3" />
                      <span>Usuario: {item.usuario}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Total: {items.length} {items.length === 1 ? 'cambio' : 'cambios'}
                </p>
                <Button variant="destructive" onClick={clearAll} size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpiar historial
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
