import { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Film, Loader2, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { useEvents } from "@/hooks/useEvents";
import { getCityBySlug } from "@/data/cityData";
import { format } from "date-fns";

const CityPage = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const navigate = useNavigate();
  const city = getCityBySlug(citySlug || "");

  const { data: events, isLoading } = useEvents({ city: city?.name, limit: 20 });

  const movieEvents = useMemo(
    () => events?.filter((e) => e.category === "movies") || [],
    [events]
  );
  const otherEvents = useMemo(
    () => events?.filter((e) => e.category !== "movies") || [],
    [events]
  );

  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 container mx-auto px-4 text-center py-20">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            City Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find events for this city.
          </p>
          <Button variant="accent" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <img
            src={city.image}
            alt={`${city.name} - ${city.tagline}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 pb-12">
          <Link to="/">
            <Button
              variant="ghost"
              className="mb-6 text-primary-foreground hover:text-accent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="text-primary-foreground/80">
                {city.state}, India
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-2">
              {city.name}
            </h1>
            <p className="text-xl text-accent font-medium mb-3">
              {city.tagline}
            </p>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mb-4">
              {city.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium backdrop-blur-sm">
                {events?.length || 0} Events
              </span>
              <span className="px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium backdrop-blur-sm">
                {city.landmarks}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Movies Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-5 h-5 text-accent" />
              <span className="text-accent font-medium">
                {city.filmIndustry}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Movies from {city.name}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Iconic films that capture the spirit and culture of {city.name}.
            </p>
          </motion.div>

          {/* Movies Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-md"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-6 py-4 text-left font-semibold">Movie Title</th>
                    <th className="px-6 py-4 text-left font-semibold">Year</th>
                    <th className="px-6 py-4 text-left font-semibold">Director</th>
                    <th className="px-6 py-4 text-left font-semibold">Genre</th>
                    <th className="px-6 py-4 text-left font-semibold hidden md:table-cell">Synopsis</th>
                  </tr>
                </thead>
                <tbody>
                  {city.movies.map((movie, index) => (
                    <tr
                      key={movie.title}
                      className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                        index % 2 === 0 ? "bg-card" : "bg-muted/30"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">
                          {movie.title}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {movie.year}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {movie.director}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                          {movie.genre}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground max-w-md hidden md:table-cell">
                        {movie.synopsis}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Movie Events in this city */}
      {movieEvents.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-gold fill-gold" />
                <span className="text-accent font-medium">Now Showing</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Movies in {city.name}
              </h2>
              <p className="text-muted-foreground">
                Book tickets for movies currently showing in {city.name}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {movieEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EventCard
                    id={event.id}
                    title={event.title}
                    image={event.image_url || "/placeholder.svg"}
                    category="Movies"
                    rating={event.rating || 0}
                    price={event.price_min}
                    date={format(new Date(event.start_date), "MMM dd, yyyy")}
                    venue={event.venue?.name || "TBA"}
                    city={event.venue?.city || city.name}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Events */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-10"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-accent" />
                <span className="text-accent font-medium">Upcoming Events</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Events in {city.name}
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Book tickets for the hottest events happening in {city.tagline.toLowerCase().replace("the ", "")}
              </p>
            </div>
            <Link to={`/events?city=${city.name}`}>
              <Button variant="outline" className="mt-4 md:mt-0">
                View All Events
              </Button>
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : otherEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
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
                    city={event.venue?.city || city.name}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
              <p>No events found in {city.name} right now. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* City Map */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="text-accent font-medium">Explore the City</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {city.name} on the Map
            </h2>
            <p className="text-muted-foreground">
              Discover event venues and landmarks across {city.name}
            </p>
          </motion.div>
          <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
            <iframe
              title={`${city.name} Map`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(`${city.name} ${city.state} India`)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-80 md:h-96 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* City Highlights */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why {city.name}?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {city.tagline} — a city like no other
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {city.highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CityPage;
