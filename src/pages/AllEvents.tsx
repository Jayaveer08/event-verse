import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { EventFilters } from "@/components/EventFilters";
import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const CATEGORIES = [
  { value: "music", label: "Music & Concerts" },
  { value: "sports", label: "Sports" },
  { value: "arts_culture", label: "Arts & Culture" },
  { value: "movies", label: "Movies" },
  { value: "food_drink", label: "Food & Drink" },
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "family_kids", label: "Family & Kids" },
  { value: "outdoor", label: "Outdoor" },
];

const LANGUAGES = [
  "Hindi", "English", "Telugu", "Tamil", "Kannada",
  "Malayalam", "Bengali", "Urdu", "Japanese", "Sanskrit",
].map((l) => ({ value: l, label: l }));

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
].map((c) => ({ value: c, label: c }));

const AllEvents = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "all"
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedDate, setSelectedDate] = useState(searchParams.get("date") || "");

  // Sync filters from URL on navigation
  useEffect(() => {
    const cat = searchParams.get("category");
    const city = searchParams.get("city");
    const q = searchParams.get("search");
    const d = searchParams.get("date");
    if (cat) setSelectedCategory(cat);
    if (city) setSelectedCity(city);
    setSearchQuery(q || "");
    setSelectedDate(d || "");
  }, [searchParams]);

  // Fetch events with optional category filter for better performance
  const { data: events, isLoading } = useEvents(
    selectedCategory !== "all" ? { category: selectedCategory } : undefined
  );

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const q = searchQuery.trim().toLowerCase();
    return events.filter((event) => {
      const languageMatch =
        selectedLanguage === "all" ||
        event.languages?.includes(selectedLanguage);
      const cityMatch =
        selectedCity === "all" || event.venue?.city === selectedCity;
      const searchMatch =
        !q ||
        event.title?.toLowerCase().includes(q) ||
        event.description?.toLowerCase().includes(q) ||
        event.venue?.name?.toLowerCase().includes(q) ||
        event.venue?.city?.toLowerCase().includes(q) ||
        (event.tags as string[] | undefined)?.some((t) => t.toLowerCase().includes(q));
      const dateMatch =
        !selectedDate ||
        (event.start_date && String(event.start_date).slice(0, 10) === selectedDate);
      return languageMatch && cityMatch && searchMatch && dateMatch;
    });
  }, [events, selectedLanguage, selectedCity, searchQuery, selectedDate]);

  const clearAllFilters = () => {
    setSelectedCategory("all");
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
            <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-gold blur-3xl" />
            <div className="absolute bottom-5 left-16 w-56 h-56 rounded-full bg-accent blur-3xl" />
          </div>
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground mb-4">
                <CalendarDays className="w-4 h-4" />
                <span className="text-sm font-medium">All Events & Theatre</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-3">
                Discover Events Near You
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                From concerts and theatre to sports and tech — find and book the best events across India
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters + Listing */}
        <section className="container mx-auto px-4 py-8 space-y-6">
          <EventFilters
            categories={CATEGORIES}
            languages={LANGUAGES}
            cities={CITIES}
            selectedCategory={selectedCategory}
            selectedLanguage={selectedLanguage}
            selectedCity={selectedCity}
            onCategoryChange={setSelectedCategory}
            onLanguageChange={setSelectedLanguage}
            onCityChange={setSelectedCity}
            onClearAll={clearAllFilters}
            resultCount={filteredEvents.length}
          />

          {/* Featured Highlights */}
          {!isLoading && filteredEvents.some((e) => e.is_featured) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="font-display text-xl font-bold text-foreground">Featured Events</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents
                  .filter((e) => e.is_featured)
                  .slice(0, 3)
                  .map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
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
                        isFeatured
                      />
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          {/* All Events Grid */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              All Events
              {selectedCategory !== "all" && ` — ${CATEGORIES.find((c) => c.value === selectedCategory)?.label}`}
              {selectedCity !== "all" && ` in ${selectedCity}`}
            </h2>

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
                <CalendarDays className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No events found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to discover more events
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
                    transition={{ delay: i * 0.03 }}
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

export default AllEvents;
