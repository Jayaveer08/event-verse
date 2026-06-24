import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { FeaturedEvents } from "@/components/FeaturedEvents";
import { CitiesSection } from "@/components/CitiesSection";
import { AppDownloadSection } from "@/components/AppDownloadSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedEvents />
        <CitiesSection />
        <AppDownloadSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
