import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, ArrowRight, Info, Users, History, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { getAllLocalidades, deleteLocalidad, updateLocalidadStatus, getLocalidadesPublicadas } from "@/utils/localidadIndexedDB";
import { Localidad } from "@/utils/db";
import { toast } from "@/hooks/use-toast";

export default function DashboardAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar localidades desde IndexedDB
  useEffect(() => {
    const loadLocalidades = async () => {
      setIsLoading(true);
      try {
        const todasLasLocalidades = await getAllLocalidades();
        setLocalidades(todasLasLocalidades);
      } catch (error) {
        console.error('Error cargando localidades:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las localidades",
          variant: "destructive",
        });
        setLocalidades([]); // Asegurar que no sea undefined
      } finally {
        setIsLoading(false);
      }
    };

    loadLocalidades();
  }, []);

  const handleAddLocalidad = () => {
    const nuevoId = crypto.randomUUID();
    // Redirigir directamente al formulario
    navigate(`/dashboard/admin/localidades/${nuevoId}/info`);
  };

  const handleDeleteLocalidad = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar esta localidad? Esta acción no se puede deshacer.")) return;
    
    try {
      const deleted = await deleteLocalidad(id);
      if (deleted) {
        setLocalidades(localidades.filter((l) => l.id !== id));
        toast({
          title: "✅ Localidad eliminada",
          description: "La localidad ha sido eliminada exitosamente",
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar la localidad",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error eliminando localidad:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la localidad",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: Localidad['status']) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const updated = await updateLocalidadStatus(id, newStatus, user?.nombre || 'Admin');
      
      if (updated) {
        setLocalidades(localidades.map(loc => 
          loc.id === id ? { ...loc, status: newStatus, publicada: newStatus === 'published' } : loc
        ));
        toast({
          title: newStatus === 'published' ? "✅ Localidad publicada" : "✅ Localidad despublicada",
          description: newStatus === 'published' 
            ? "La localidad ahora es visible en la página de Rutas"
            : "La localidad ya no es visible públicamente",
        });
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado",
        variant: "destructive",
      });
    }
  };

  const handleGoToSection = (localidadId: string, section: "info" | "guias" | "historial") => {
    navigate(`/dashboard/admin/localidades/${localidadId}/${section}`);
  };

  // Vista principal del dashboard
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Panel de Administración
            <span className="text-green-600 ml-2 text-lg">({user?.nombre})</span>
          </h1>
          <Button
            onClick={handleAddLocalidad}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 self-start sm:self-auto"
          >
            <PlusCircle className="w-5 h-5" />
            Agregar Localidad
          </Button>
        </div>

        {/* Lista de localidades existentes */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-600">Cargando localidades...</p>
            </div>
          </div>
        ) : localidades.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay localidades registradas</h3>
            <p className="text-gray-600 mb-6">Comienza agregando tu primera localidad turística.</p>
            <Button
              onClick={handleAddLocalidad}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Crear primera localidad
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {localidades.map((loc) => (
              <Card
                key={loc.id}
                className="hover:shadow-lg transition-all duration-200 border-2 hover:border-green-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg font-semibold text-gray-800 flex-1 truncate">
                      {loc.nombre}
                    </CardTitle>
                    <Badge 
                      variant={loc.status === 'published' ? 'default' : 'secondary'}
                      tabIndex={0}
                      className={loc.status === 'published' ? 'bg-green-500' : ''}
                    >
                      {loc.status === 'published' ? 'Publicada' : 'Borrador'}
                    </Badge>
                  </div>
                  {loc.descripcionCorta && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{loc.descripcionCorta}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => handleGoToSection(loc.id, "info")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    Información
                  </Button>
                  <Button
                    onClick={() => handleGoToSection(loc.id, "guias")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Guías
                  </Button>
                  <Button
                    onClick={() => handleGoToSection(loc.id, "historial")}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Historial
                  </Button>
                  <Button
                    onClick={() => handleToggleStatus(loc.id, loc.status)}
                    variant={loc.status === 'published' ? 'outline' : 'default'}
                    className={`w-full text-sm ${loc.status === 'published' ? 'border-orange-300 text-orange-700 hover:bg-orange-50' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                  >
                    {loc.status === 'published' ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Despublicar
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Publicar
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleDeleteLocalidad(loc.id)}
                    variant="destructive"
                    className="w-full mt-3 text-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    
  );
}