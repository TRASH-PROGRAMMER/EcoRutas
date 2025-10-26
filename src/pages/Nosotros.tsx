import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Nosotros = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Sobre Nosotros</h1>
          <p className="text-lg text-muted-foreground">Próximamente: nuestra historia y misión</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Nosotros;
