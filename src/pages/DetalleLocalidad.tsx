import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import { 
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Star,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getLocalidadById, getImageUrls } from "@/utils/localidadIndexedDB";
import { Localidad } from "@/utils/db";

const DetalleLocalidad = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const localidadId = searchParams.get('localidad');
  const [localidad, setLocalidad] = useState<Localidad | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadLocalidad = async () => {
      setIsLoading(true);
      try {
        if (localidadId) {
          const data = await getLocalidadById(localidadId);
          if (data && data.status === 'published') {
            setLocalidad(data);
          }
        }
      } catch (error) {
        console.error('Error cargando localidad:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLocalidad();
  }, [localidadId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando localidad...</p>
        </div>
      </div>
    );
  }

  if (!localidad) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 mb-4">Localidad no encontrada o no está publicada.</p>
              <Button onClick={() => navigate('/rutas')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Rutas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const imagenes = localidad.imagenes && localidad.imagenes.length > 0 
    ? getImageUrls(localidad)
    : ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E"];

  const currentImage = imagenes[currentImageIndex];
  const hasMultipleImages = imagenes.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imagenes.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="pt-12 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Botón Volver */}
          <Button 
            onClick={() => navigate('/rutas')} 
            variant="ghost" 
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Rutas
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna Izquierda: Imágenes */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={currentImage}
                      alt={localidad.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    
                    {/* Navegación de imágenes */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          aria-label="Imagen anterior"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          aria-label="Siguiente imagen"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {imagenes.length}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Miniaturas */}
              {hasMultipleImages && (
                <div className="grid grid-cols-4 gap-2">
                  {imagenes.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-primary ring-2 ring-primary/50'
                          : 'border-gray-200 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Columna Derecha: Información */}
            <div className="space-y-6">
              {/* Título y Badges */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{localidad.nombre}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-sm">
                    {localidad.tipo}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {localidad.categoria}
                  </Badge>
                  {localidad.idiomas && localidad.idiomas.length > 0 && (
                    <Badge variant="outline" className="text-sm">
                      Idiomas: {localidad.idiomas.join(', ')}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">
                    {localidad.ubicacion || `${localidad.ciudad}, ${localidad.provincia}, ${localidad.pais}`}
                  </span>
                </div>
              </div>

              {/* Información Principal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Información de la Localidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Temporada Alta</p>
                        <p className="font-semibold">{localidad.temporadaAlta || 'Todo el año'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Capacidad</p>
                        <p className="font-semibold">{localidad.capacidadMaxima || 'No especificada'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Accesibilidad</p>
                        <p className="font-semibold">{localidad.accesibilidad || 'No especificada'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Temporada Baja</p>
                        <p className="font-semibold">{localidad.temporadaBaja || 'No especificada'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Descripción */}
              <Card>
                <CardHeader>
                  <CardTitle>Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {localidad.descripcion || localidad.descripcionCorta || 'Sin descripción disponible.'}
                  </p>
                </CardContent>
              </Card>

              {/* Información Adicional */}
              {(localidad.coordenadas || localidad.altitud || localidad.clima) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detalles Adicionales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {localidad.coordenadas && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Coordenadas: </span>
                        <span className="text-sm text-gray-700">{localidad.coordenadas}</span>
                      </div>
                    )}
                    {localidad.altitud && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Altitud: </span>
                        <span className="text-sm text-gray-700">{localidad.altitud}</span>
                      </div>
                    )}
                    {localidad.clima && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Clima: </span>
                        <span className="text-sm text-gray-700">{localidad.clima}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Precio y Botón de Reserva */}
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mb-1">
                        <DollarSign className="w-4 h-4" />
                        Precio por persona
                      </div>
                      <div className="text-4xl font-bold text-primary">
                        ${localidad.precioPorPersona || 0}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate(`/reservar?localidad=${localidad.id}`)}
                    className="w-full text-lg py-6"
                    size="lg"
                  >
                    Reservar Ahora
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Confirma tu reserva y te contactaremos pronto
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DetalleLocalidad;


