import { motion } from "framer-motion";
import { MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import hyderabadImage from "@/assets/hyderabad-city.jpg";
import { useCityEventCounts } from "@/hooks/useCityEventCounts";

const cities = [
  {
    name: "Mumbai",
    state: "Maharashtra",
    events: 2847,
    image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80",
    slug: "mumbai",
  },
  {
    name: "Delhi",
    state: "Delhi NCR",
    events: 2156,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
    slug: "delhi",
  },
  {
    name: "Bangalore",
    state: "Karnataka",
    events: 1893,
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80",
    slug: "bangalore",
  },
  {
    name: "Chennai",
    state: "Tamil Nadu",
    events: 1456,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80",
    slug: "chennai",
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    events: 1234,
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80",
    slug: "kolkata",
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    events: 1567,
    image: hyderabadImage,
    slug: "hyderabad",
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    events: 892,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
    slug: "jaipur",
  },
  {
    name: "Pune",
    state: "Maharashtra",
    events: 1123,
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80",
    slug: "pune",
  },
];

export function CitiesSection() {
  const { data: cityCounts } = useCityEventCounts();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="text-accent font-medium">Browse by Location</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Events in Your City
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Discover amazing events happening in major cities across India
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0">
            View All Cities <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/city/${city.slug}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative h-48 md:h-56 rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-xl font-bold text-primary-foreground mb-1">
                      {city.name}
                    </h3>
                    <p className="text-sm text-primary-foreground/70 mb-2">{city.state}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-accent bg-card/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      {(cityCounts?.[city.name] ?? city.events).toLocaleString("en-IN")} events
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
