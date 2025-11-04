import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FeaturedRoutes from "@/components/FeaturedRoutes";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background w-full">`
      <main>
        <Hero />
        <Features />
        <FeaturedRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
