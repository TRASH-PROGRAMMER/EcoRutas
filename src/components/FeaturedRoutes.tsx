import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import routeMountains from "@/assets/route-mountains.jpg";
import routeRiver from "@/assets/route-river.jpg";
import routeCulture from "@/assets/route-culture.jpg";

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
}

const RouteCard = ({ title, community, duration, groupSize, rating, reviews, price, image, category }: RouteCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/50">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={image}
          alt={`Ruta eco-turística ${title} en ${community}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
          {category}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-xl text-foreground line-clamp-2">{title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
            <span className="font-semibold text-sm">{rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm">{community}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>{groupSize}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{reviews} opiniones</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t border-border/50">
        <div>
          <p className="text-2xl font-bold text-primary">{price}</p>
          <p className="text-xs text-muted-foreground">por persona</p>
        </div>
        <Button asChild>
          <Link to="/reservar">Reservar</Link>
        </Button>
      </CardFooter>
    </Card>
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
      image: routeMountains,
      category: "Naturaleza"
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
      image: routeRiver,
      category: "Aventura"
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
      image: routeCulture,
      category: "Cultura"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Rutas Destacadas
          </h2>
          <p className="text-lg text-muted-foreground">
            Experiencias auténticas diseñadas y guiadas por comunidades locales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {routes.map((route) => (
            <RouteCard key={route.id} {...route} />
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/rutas">Ver Todas las Rutas</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRoutes;
