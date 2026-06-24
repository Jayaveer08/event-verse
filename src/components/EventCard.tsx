import { motion } from "framer-motion";
import { Star, Clock, MapPin, Heart, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EventCardProps {
  id: string;
  title: string;
  image: string;
  category: string;
  rating: number;
  price: number;
  date: string;
  venue: string;
  city: string;
  isFeatured?: boolean;
  tags?: string[];
  district?: string;
  startTime?: string;
}

export function EventCard({
  id,
  title,
  image,
  category,
  rating,
  price,
  date,
  venue,
  city,
  isFeatured = false,
  tags = [],
  district,
  startTime,
}: EventCardProps) {
  return (
    <Link to={`/event/${id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className={cn(
          "group relative bg-card rounded-2xl overflow-hidden border border-border transition-shadow duration-300 hover:shadow-lg",
          isFeatured && "md:col-span-2 md:row-span-2"
        )}
      >
      {/* Image */}
      <div className={cn("relative overflow-hidden", isFeatured ? "h-64 md:h-80" : "h-48")}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-overlay opacity-60" />

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
          <Heart className="w-4 h-4 text-foreground hover:text-accent transition-colors" />
        </button>

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
          {category}
        </span>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-card/80 backdrop-blur-sm">
          <Star className="w-3.5 h-3.5 text-gold fill-gold" />
          <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className={cn(
          "font-display font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors",
          isFeatured ? "text-xl" : "text-lg"
        )}>
          {title}
        </h3>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-medium uppercase tracking-wide"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-accent shrink-0" />
            <span>{date}{startTime ? ` · ${startTime}` : ""}</span>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue} ${city}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <MapPin className="w-4 h-4 text-accent shrink-0" />
            <span className="truncate">
              {venue}
              {district ? `, ${district}` : ""}
              {city ? ` · ${city}` : ""}
            </span>
          </a>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Starting from</span>
            <p className="text-xl font-bold text-foreground">
              ₹{price.toLocaleString("en-IN")}
            </p>
          </div>
          <Button variant="accent" size="sm">
            Book Now
          </Button>
        </div>
      </div>
      </motion.div>
    </Link>
  );
}
