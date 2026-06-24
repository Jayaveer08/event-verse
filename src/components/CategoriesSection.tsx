import { motion } from "framer-motion";
import { Film, Music, Trophy, Theater, Mic, Sparkles } from "lucide-react";

const categories = [
  {
    id: "movies",
    icon: Film,
    label: "Movies",
    count: "2,500+",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: "concerts",
    icon: Music,
    label: "Concerts",
    count: "850+",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "sports",
    icon: Trophy,
    label: "Sports",
    count: "1,200+",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "theater",
    icon: Theater,
    label: "Theater",
    count: "650+",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "comedy",
    icon: Mic,
    label: "Comedy",
    count: "400+",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "experiences",
    icon: Sparkles,
    label: "Experiences",
    count: "980+",
    gradient: "from-fuchsia-500 to-pink-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Browse by Category
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What's on Your Mind?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore thousands of events across different categories happening near you
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {categories.map((category) => (
            <motion.a
              key={category.id}
              href={`#${category.id}`}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 text-center cursor-pointer transition-shadow hover:shadow-lg"
            >
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <category.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{category.label}</h3>
              <p className="text-sm text-muted-foreground">{category.count} events</p>

              {/* Hover gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
