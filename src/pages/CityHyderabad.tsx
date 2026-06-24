import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Star, Clock, Film } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import hyderabadImage from "@/assets/hyderabad-city.jpg";

// Movies set in or related to Hyderabad
const hyderabadMovies = [
  {
    title: "Baahubali: The Beginning",
    year: 2015,
    director: "S.S. Rajamouli",
    genre: "Action, Drama",
    synopsis: "An epic tale of a warrior raised in obscurity who discovers his royal lineage and battles to reclaim his kingdom. Shot extensively in Hyderabad's Ramoji Film City.",
  },
  {
    title: "Baahubali 2: The Conclusion",
    year: 2017,
    director: "S.S. Rajamouli",
    genre: "Action, Drama",
    synopsis: "The sequel continues the epic saga, revealing the fate of the legendary warrior. Major production at Ramoji Film City, Hyderabad.",
  },
  {
    title: "RRR",
    year: 2022,
    director: "S.S. Rajamouli",
    genre: "Action, Drama",
    synopsis: "A fictional story of two Indian revolutionaries against British rule. Produced in Hyderabad with spectacular visual effects.",
  },
  {
    title: "Pushpa: The Rise",
    year: 2021,
    director: "Sukumar",
    genre: "Action, Thriller",
    synopsis: "A laborer rises through the ranks of a red sandalwood smuggling syndicate. Shot in and around Hyderabad.",
  },
  {
    title: "Eega",
    year: 2012,
    director: "S.S. Rajamouli",
    genre: "Fantasy, Romance",
    synopsis: "A man reincarnated as a housefly seeks revenge against his killer. Innovative film produced in Hyderabad.",
  },
  {
    title: "Arjun Reddy",
    year: 2017,
    director: "Sandeep Reddy Vanga",
    genre: "Drama, Romance",
    synopsis: "A brilliant but short-tempered surgeon spirals into self-destruction after a heartbreak. Set primarily in Hyderabad.",
  },
  {
    title: "Mahanati",
    year: 2018,
    director: "Nag Ashwin",
    genre: "Biography, Drama",
    synopsis: "The biographical story of legendary actress Savitri. Captures old Hyderabad's charm and the Telugu film industry.",
  },
  {
    title: "Jersey",
    year: 2019,
    director: "Gowtam Tinnanuri",
    genre: "Drama, Sports",
    synopsis: "A failed cricketer decides to return to the game in his late thirties for his son's dream. Filmed in Hyderabad.",
  },
];

// Events happening in Hyderabad
const hyderabadEvents = [
  {
    id: "hyd-1",
    title: "Pushpa 2: The Rule - IMAX Premiere",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    category: "Movies",
    rating: 4.8,
    price: 450,
    date: "Now Showing",
    venue: "PVR IMAX",
    city: "Hyderabad",
  },
  {
    id: "hyd-2",
    title: "Sunburn Festival Hyderabad 2025",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    category: "Concert",
    rating: 4.7,
    price: 2499,
    date: "Sat, 22 Feb 2025",
    venue: "Hitex Exhibition Center",
    city: "Hyderabad",
  },
  {
    id: "hyd-3",
    title: "IPL 2025 - SRH vs RCB",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80",
    category: "Sports",
    rating: 4.9,
    price: 1299,
    date: "Sun, 16 Mar 2025",
    venue: "Rajiv Gandhi Stadium",
    city: "Hyderabad",
  },
  {
    id: "hyd-4",
    title: "Zakir Khan - Live in Hyderabad",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80",
    category: "Comedy",
    rating: 4.6,
    price: 999,
    date: "Fri, 7 Mar 2025",
    venue: "Shilpakala Vedika",
    city: "Hyderabad",
  },
];

const CityHyderabad = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <img
            src={hyderabadImage}
            alt="Hyderabad - City of Pearls featuring historic monuments and modern skyline"
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
              <span className="text-primary-foreground/80">Telangana, India</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
              Hyderabad
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mb-4">
              The City of Pearls - Where ancient Charminar meets modern HITEC City. 
              Experience the rich Nizami heritage, delectable Biryani, and world-class Telugu cinema.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium backdrop-blur-sm">
                1,567 Events
              </span>
              <span className="px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium backdrop-blur-sm">
                📍 HITEC City | Jubilee Hills | Charminar
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
              <span className="text-accent font-medium">Tollywood Blockbusters</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Movies from Hyderabad
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Hyderabad is home to Tollywood (Telugu film industry) and has produced some of India's biggest blockbusters.
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
                  {hyderabadMovies.map((movie, index) => (
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

      {/* Events in Hyderabad */}
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
                Events in Hyderabad
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Book tickets for the hottest events happening in the City of Pearls
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0">
              View All Events
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hyderabadEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard {...event} />
              </motion.div>
            ))}
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
              Why Hyderabad?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A perfect blend of heritage and modernity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🏛️",
                title: "Historic Heritage",
                description: "Home to the iconic Charminar, Golconda Fort, and countless monuments of the Nizams era.",
              },
              {
                icon: "🎬",
                title: "Film Capital",
                description: "Ramoji Film City - the world's largest film studio complex and heart of Telugu cinema.",
              },
              {
                icon: "🍚",
                title: "Culinary Paradise",
                description: "Famous for Hyderabadi Biryani, Haleem, Irani Chai, and rich Nizami cuisine.",
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

export default CityHyderabad;
