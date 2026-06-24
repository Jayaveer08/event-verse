import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Film, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { useEvents } from "@/hooks/useEvents";
import heroImage from "@/assets/hero-india.jpg";

// Movies set in or related to Delhi
const delhiMovies = [
  {
    title: "Delhi-6",
    year: 2009,
    director: "Rakeysh Omprakash Mehra",
    genre: "Drama, Musical",
    synopsis: "An NRI returns to Old Delhi and gets caught up in the neighborhood's colorful life, superstitions, and communal tensions.",
  },
  {
    title: "Rang De Basanti",
    year: 2006,
    director: "Rakeysh Omprakash Mehra",
    genre: "Drama, Action",
    synopsis: "A group of Delhi University students become revolutionaries after participating in a documentary about Indian freedom fighters.",
  },
  {
    title: "Chak De! India",
    year: 2007,
    director: "Shimit Amin",
    genre: "Sports, Drama",
    synopsis: "A disgraced hockey player coaches the Indian women's team to glory. Iconic scenes at Delhi's National Stadium.",
  },
  {
    title: "Delhi Belly",
    year: 2011,
    director: "Abhinay Deo",
    genre: "Comedy, Action",
    synopsis: "Three roommates in Delhi get caught up in a gangster's diamonds, leading to hilarious chaos across the city.",
  },
  {
    title: "Khosla Ka Ghosla",
    year: 2006,
    director: "Dibakar Banerjee",
    genre: "Comedy, Drama",
    synopsis: "A middle-class Delhi man fights to reclaim his plot from a land mafia. A satirical take on Delhi's real estate.",
  },
  {
    title: "Oye Lucky! Lucky Oye!",
    year: 2008,
    director: "Dibakar Banerjee",
    genre: "Comedy, Crime",
    synopsis: "Based on a real-life Delhi thief who became infamous for his audacious and non-violent burglaries.",
  },
  {
    title: "Vicky Donor",
    year: 2012,
    director: "Shoojit Sircar",
    genre: "Comedy, Drama",
    synopsis: "A young Delhi man becomes a sperm donor, set against the colorful backdrop of Lajpat Nagar.",
  },
  {
    title: "Band Baaja Baaraat",
    year: 2010,
    director: "Maneesh Sharma",
    genre: "Romance, Comedy",
    synopsis: "Two Delhi University students start a wedding planning business and navigate love in the Big Fat Indian Wedding industry.",
  },
];

const CityDelhi = () => {
  const { data: events, isLoading, error } = useEvents({ city: 'Delhi', limit: 12 });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Delhi - The Heart of India featuring India Gate and modern skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 pb-12">
          <Link to="/">
            <Button variant="ghost" className="mb-6 text-primary-foreground hover:text-accent">
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
              <span className="text-primary-foreground/80">National Capital Territory, India</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
              Delhi
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mb-4">
              The Heart of India - Where history meets modernity. From the majestic Red Fort to 
              bustling Connaught Place, experience the vibrant culture, street food, and world-class events.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium backdrop-blur-sm">
                {events?.length || 0} Events
              </span>
              <span className="px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium backdrop-blur-sm">
                📍 Connaught Place | Hauz Khas | Chandni Chowk
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
              <span className="text-accent font-medium">Bollywood Classics</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Movies from Delhi
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Delhi's iconic streets, monuments, and culture have inspired countless Bollywood films.
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
                    <th className="px-6 py-4 text-left font-semibold">Synopsis</th>
                  </tr>
                </thead>
                <tbody>
                  {delhiMovies.map((movie, index) => (
                    <tr 
                      key={movie.title}
                      className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                        index % 2 === 0 ? 'bg-card' : 'bg-muted/30'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">{movie.title}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{movie.year}</td>
                      <td className="px-6 py-4 text-muted-foreground">{movie.director}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                          {movie.genre}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground max-w-md">
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

      {/* Events in Delhi */}
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
                Events in Delhi
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Book tickets for the hottest events happening in the Heart of India
              </p>
            </div>
            <Link to="/">
              <Button variant="outline" className="mt-4 md:mt-0">
                View All Events
              </Button>
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-muted-foreground">
              Failed to load events. Please try again later.
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event, index) => (
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
                    image={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'}
                    category={event.category.replace('_', ' ')}
                    rating={event.rating || 4.5}
                    price={event.price_min}
                    date={new Date(event.start_date).toLocaleDateString('en-IN', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                    venue={event.venue?.name || 'TBA'}
                    city={event.venue?.city || 'Delhi'}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              No events found in Delhi. Check back soon!
            </div>
          )}
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
              Why Delhi?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The city that never sleeps - a perfect blend of history and modernity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🏛️",
                title: "Rich Heritage",
                description: "Home to Red Fort, Qutub Minar, India Gate, and countless Mughal-era monuments.",
              },
              {
                icon: "🍛",
                title: "Street Food Paradise",
                description: "Famous for Chaat, Paranthas, Kebabs, and the legendary Chandni Chowk food trail.",
              },
              {
                icon: "🎭",
                title: "Cultural Hub",
                description: "India's premier destination for concerts, theatre, art exhibitions, and international events.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{item.title}</h3>
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

export default CityDelhi;
