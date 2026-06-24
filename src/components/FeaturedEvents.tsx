import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";
import { useMemo } from "react";

function extractDistrict(address?: string): string | undefined {
  if (!address) return undefined;
  const parts = address.split(",");
  return parts.length > 1 ? parts.pop()?.trim() : address.trim();
}

export function FeaturedEvents() {
  const { data: allEvents, isLoading, error } = useEvents({ featured: true });

  const events = useMemo(() => {
    if (!allEvents) return [];

    // Group by category
    const byCategory = new Map<string, typeof allEvents>();
    for (const event of allEvents) {
      const list = byCategory.get(event.category) || [];
      list.push(event);
      byCategory.set(event.category, list);
    }

    // Shuffle within each category
    for (const [cat, list] of byCategory) {
      byCategory.set(cat, list.sort(() => Math.random() - 0.5));
    }

    // Round-robin pick to ensure category diversity
    const result = [];
    const categories = Array.from(byCategory.keys());
    let idx = 0;
    while (result.length < 5) {
      let added = false;
      for (const cat of categories) {
        const list = byCategory.get(cat)!;
        if (idx < list.length && result.length < 5) {
          result.push(list[idx]);
          added = true;
        }
      }
      if (!added) break;
      idx++;
    }

    return result;
  }, [allEvents]);

  // Format category for display
  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-accent font-medium">Trending Now</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Events
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Don't miss out on the hottest events happening across India
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0">
            View All Events <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
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
                transition={{ delay: index * 0.1 }}
                className={index === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : ""}
              >
                <EventCard
                  id={event.id}
                  title={event.title}
                  image={event.image_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80"}
                  category={formatCategory(event.category)}
                  rating={event.rating || 0}
                  price={event.price_min}
                  date={format(new Date(event.start_date), "EEE, d MMM yyyy")}
                  startTime={format(new Date(event.start_date), "h:mm a")}
                  venue={event.venue?.name || "Venue TBA"}
                  city={event.venue?.city || ""}
                  district={extractDistrict(event.venue?.address)}
                  tags={event.tags || []}
                  isFeatured={index === 0}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            No featured events available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}
