import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Film, TrendingUp, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { EventFilters } from "@/components/EventFilters";
import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const LANGUAGES = [
  "Hindi", "English", "Telugu", "Tamil", "Kannada",
  "Malayalam", "Bengali", "Urdu", "Japanese", "Sanskrit",
].map((l) => ({ value: l, label: l }));

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
].map((c) => ({ value: c, label: c }));

const Movies = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");

  const { data: events, isLoading } = useEvents({ category: "movies" });

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    return events.filter((event) => {
      const languageMatch =
        selectedLanguage === "all" ||
        event.languages?.includes(selectedLanguage);
      const cityMatch =
        selectedCity === "all" || event.venue?.city === selectedCity;
      return languageMatch && cityMatch;
    });
  }, [events, selectedLanguage, selectedCity]);

  const clearAllFilters = () => {
    setSelectedLanguage("all");
    setSelectedCity("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Hero Banner */}
        <section className="relative bg-gradient-hero py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-accent blur-3xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-primary blur-3xl" />
          </div>
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground mb-4">
                <Film className="w-4 h-4" />
                <span className="text-sm font-medium">Movies & Cinema</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-3">
                Now Showing & Upcoming
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                Book tickets for the latest blockbusters, indie gems, and film festivals across India
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters + Listing */}
        <section className="container mx-auto px-4 py-8 space-y-6">
          <EventFilters
            languages={LANGUAGES}
            cities={CITIES}
            selectedCategory="all"
            selectedLanguage={selectedLanguage}
            selectedCity={selectedCity}
            onCategoryChange={() => {}}
            onLanguageChange={setSelectedLanguage}
            onCityChange={setSelectedCity}
            onClearAll={clearAllFilters}
            resultCount={filteredEvents.length}
          />

          {/* Trending Movies */}
          {!isLoading && filteredEvents.some((e) => e.is_trending) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-destructive" />
                <h2 className="font-display text-xl font-bold text-foreground">Trending Now</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents
                  .filter((e) => e.is_trending)
                  .map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <EventCard
                        id={event.id}
                        title={event.title}
                        image={event.image_url || "/placeholder.svg"}
                        category={event.category.replace("_", " ")}
                        rating={event.rating || 0}
                        price={event.price_min}
                        date={format(new Date(event.start_date), "MMM dd, yyyy")}
                        venue={event.venue?.name || "TBA"}
                        city={event.venue?.city || ""}
                        isFeatured={event.is_featured || false}
                      />
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          {/* All Movies */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-gold fill-gold" />
              <h2 className="font-display text-xl font-bold text-foreground">
                All Movies
                {selectedLanguage !== "all" && ` in ${selectedLanguage}`}
                {selectedCity !== "all" && ` — ${selectedCity}`}
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Film className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No movies found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearAllFilters}
                  className="text-accent hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <EventCard
                      id={event.id}
                      title={event.title}
                      image={event.image_url || "/placeholder.svg"}
                      category={event.category.replace("_", " ")}
                      rating={event.rating || 0}
                      price={event.price_min}
                      date={format(new Date(event.start_date), "MMM dd, yyyy")}
                      venue={event.venue?.name || "TBA"}
                      city={event.venue?.city || ""}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Movies;
