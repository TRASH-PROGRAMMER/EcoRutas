import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, Trash2, ArrowRight, Info, Users, History, ArrowLeft } from "lucide-react";

interface Localidad {
  id: string;
  nombre: string;
}

export default function DashboardAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [showCards, setShowCards] = useState(false);
  const [newLocalidadId, setNewLocalidadId] = useState<string | null>(null);

  const handleAddLocalidad = () => {
    const nuevoId = `localidad-${Date.now()}`;
    setLocalidades([...localidades, { id: nuevoId, nombre: `Nueva localidad ${localidades.length + 1}` }]);
    setNewLocalidadId(nuevoId);
    setShowCards(true);
  };

  const handleDeleteLocalidad = (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar esta localidad? Esta acción no se puede deshacer.")) return;
    setLocalidades(localidades.filter((l) => l.id !== id));
  };

  const handleCardClick = (section: "info" | "guias" | "historial") => {
    if (newLocalidadId) {
      navigate(`/dashboard/admin/localidades/${newLocalidadId}/${section}`);
    }
  };

  const handleBackToList = () => {
    setShowCards(false);
    setNewLocalidadId(null);
  };

  const handleGoToSection = (localidadId: string, section: "info" | "guias" | "historial") => {
    navigate(`/dashboard/admin/localidades/${localidadId}/${section}`);
  };

  // Si estamos mostrando las tarjetas para nueva localidad
  if (showCards && newLocalidadId) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header con botón de regreso */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Nueva Localidad
                <span className="text-green-600 ml-2 text-lg">({user?.nombre})</span>
              </h1>
              <p className="text-gray-600 mt-1">Selecciona una opción para continuar</p>
            </div>
            <Button
              onClick={handleBackToList}
              variant="outline"
              className="flex items-center gap-2 self-start sm:self-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Button>
          </div>

          {/* Tarjetas horizontales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* 🟩 Información general */}
            <Card 
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4 border-l-green-500 bg-green-50 hover:bg-green-100"
              onClick={() => handleCardClick("info")}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Info className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Información general</h3>
                    <p className="text-sm text-green-600 font-normal mt-1">
                      Datos básicos de la localidad
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Configura el nombre, ubicación, descripción y características principales de la localidad turística.
                </p>
                <div className="flex items-center text-green-600 font-medium">
                  <span>Comenzar registro</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>

            {/* 🟦 Gestión de guías y horarios */}
            <Card 
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4 border-l-blue-500 bg-blue-50 hover:bg-blue-100"
              onClick={() => handleCardClick("guias")}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-blue-700">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Gestión de guías</h3>
                    <p className="text-sm text-blue-600 font-normal mt-1">
                      Administrar personal y horarios
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Administra los guías turísticos, sus horarios de trabajo, idiomas y especialidades.
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  <span>Gestionar guías</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>

            {/* 🟨 Historial de cambios */}
            <Card 
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4 border-l-yellow-500 bg-yellow-50 hover:bg-yellow-100"
              onClick={() => handleCardClick("historial")}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-yellow-700">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <History className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Historial de cambios</h3>
                    <p className="text-sm text-yellow-600 font-normal mt-1">
                      Registro de modificaciones
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Consulta el historial completo de cambios, modificaciones y actualizaciones realizadas.
                </p>
                <div className="flex items-center text-yellow-600 font-medium">
                  <span>Ver historial</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información adicional */}
          <Alert className="mt-8 border-blue-200 bg-blue-50">
            <Info className="w-4 h-4" />
            <AlertDescription className="text-blue-800">
              <strong>Recomendación:</strong> Te sugerimos comenzar por la "Información general" para registrar los datos básicos de la localidad.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

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
        {localidades.length === 0 ? (
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
                  <CardTitle className="text-lg font-semibold text-gray-800 truncate">
                    {loc.nombre}
                  </CardTitle>
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