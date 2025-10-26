import React, { useState } from 'react';
import { MapPin, Users, Clock, Star, Heart, Info, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";



interface RouteCardProps {
  id: string;
  title: string;
  community: string;
  duration: string;
  groupSize: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  category: string;
  difficulty?: 'Fácil' | 'Moderado' | 'Difícil';
  isPopular?: boolean;
  description?: string;
}

const RouteCard = ({ 
  id,
  title, 
  community, 
  duration, 
  groupSize, 
  rating, 
  reviews, 
  price, 
  image, 
  category,
  difficulty = 'Moderado',
  isPopular = false,
  description = ''
}: RouteCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const difficultyColors = {
    'Fácil': 'bg-green-500/90',
    'Moderado': 'bg-yellow-500/90',
    'Difícil': 'bg-red-500/90'
  };

  return (
    <article 
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-labelledby={`route-title-${id}`}
    >
      {/* Imagen con overlay mejorado */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={`Experiencia de ${category.toLowerCase()}: ${title} en ${community}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay oscuro mejorado para mejor contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
        
        {/* Badges superiores con mejor contraste */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-600 text-white shadow-lg">
            {category}
          </span>
          {isPopular && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold bg-orange-500 text-white shadow-lg">
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              Popular
            </span>
          )}
        </div>

        {/* Badge de dificultad */}
        <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>

        {/* Botón de favorito mejorado */}
        <button
          onClick={handleFavoriteClick}
          className="absolute bottom-4 right-4 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          aria-pressed={isFavorite}
        >
          <Heart 
            className={`h-5 w-5 transition-colors duration-200 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
            aria-hidden="true"
          />
        </button>
      </div>
      
      {/* Contenido de la card */}
      <div className="p-6">
        {/* Header con título y rating */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 
              id={`route-title-${id}`}
              className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-200"
            >
              {title}
            </h3>
            <div 
              className="flex items-center gap-1 shrink-0 bg-yellow-50 px-2 py-1 rounded-md"
              role="img"
              aria-label={`Calificación ${rating} de 5 estrellas`}
            >
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
              <span className="font-semibold text-sm text-gray-900">{rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm">{community}</span>
          </div>
        </div>

        {/* Descripción breve (aparece en hover) */}
        {description && (
          <div 
            className={`overflow-hidden transition-all duration-300 ${
              isHovered ? 'max-h-20 opacity-100 mb-4' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          </div>
        )}

        {/* Información de duración y grupo */}
        <div className="flex items-center gap-5 mb-3 text-gray-600">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm">{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm">{groupSize}</span>
          </div>
        </div>

        {/* Reviews con mejor visibilidad */}
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-medium text-gray-700">{reviews}</span> opiniones verificadas
        </p>

        {/* Footer con precio y botón */}
        <div className="flex items-end justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-3xl font-bold text-emerald-600">{price}</p>
            <p className="text-xs text-gray-500">por persona</p>
          </div>
          <button
            className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
            aria-label={`Reservar ${title}`}
          >
            <Link to="/reservar">Reservar</Link>
          </button>
        </div>
      </div>

      {/* Tooltip informativo (aparece en hover) */}
      <div 
        className={`absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md whitespace-nowrap transition-all duration-200 pointer-events-none ${
          isHovered ? 'opacity-100 -translate-y-2' : 'opacity-0 translate-y-0'
        }`}
        role="tooltip"
      >
        Click para ver detalles
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </article>
  );
};

const FeaturedRoutes = () => {
  const routes: RouteCardProps[] = [
    {
      id: "1",
      title: "Caminata al Bosque Nublado",
      community: "Comunidad El Paraíso",
      duration: "6 horas",
      groupSize: "4-8 personas",
      rating: 4.9,
      reviews: 127,
      price: "$45",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
      category: "Naturaleza",
      difficulty: "Moderado",
      isPopular: true,
      description: "Explora senderos místicos envueltos en niebla con guías locales expertos."
    },
    {
      id: "2",
      title: "Ruta del Río Cristalino",
      community: "San Miguel del Agua",
      duration: "4 horas",
      groupSize: "2-6 personas",
      rating: 4.8,
      reviews: 89,
      price: "$35",
      image: "https://kayakecuador.net/wp-content/uploads/2019/05/Kayak-Ecuador-Jondachi-3.jpg",
      category: "Aventura",
      difficulty: "Fácil",
      description: "Navega por aguas cristalinas y descubre la vida silvestre local."
    },
    {
      id: "3",
      title: "Experiencia Cultural y Artesanías",
      community: "Comunidad Raíces Vivas",
      duration: "3 horas",
      groupSize: "2-10 personas",
      rating: 5.0,
      reviews: 156,
      price: "$28",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9TMIOe73Ncu1W4qjduoSeGDg270FlBTI1rA&s",
      category: "Cultura",
      difficulty: "Fácil",
      isPopular: true,
      description: "Aprende técnicas ancestrales de artesanía con maestros locales."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="featured-routes-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header mejorado */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 
            id="featured-routes-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Rutas Destacadas
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Experiencias auténticas diseñadas y guiadas por comunidades locales
          </p>
        </div>

        {/* Grid de rutas con mejor espaciado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
          {routes.map((route) => (
            <RouteCard key={route.id} {...route} />
          ))}
        </div>

        {/* CTA mejorado */}
        <div className="text-center">
          <button
            className="px-8 py-4 bg-white text-emerald-600 font-semibold text-lg rounded-lg border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-md hover:shadow-xl transform hover:-translate-y-1"
            aria-label="Ver el catálogo completo de rutas eco-turísticas"
          >
            Ver Todas las Rutas
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRoutes;