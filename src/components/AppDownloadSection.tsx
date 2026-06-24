import { motion } from "framer-motion";
import { Download, Star, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Book tickets in seconds with our streamlined checkout",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "100% secure transactions with multiple payment options",
  },
  {
    icon: Star,
    title: "Exclusive Offers",
    description: "Get app-only discounts and early access to events",
  },
];

export function AppDownloadSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-teal-dark relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-6">
              📱 Download the App
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Book Events on the Go
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
              Get the EventVerse app for a seamless booking experience. Available on iOS and Android.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-foreground">{feature.title}</h4>
                    <p className="text-sm text-primary-foreground/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl">
                <Download className="w-5 h-5" />
                Download for iOS
              </Button>
              <Button variant="hero-outline" size="xl">
                <Download className="w-5 h-5" />
                Download for Android
              </Button>
            </div>
          </motion.div>

          {/* Phone Mockup Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="relative w-72 h-[580px] bg-gradient-to-br from-card to-secondary rounded-[3rem] border-8 border-foreground/20 shadow-2xl overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-8 bg-foreground/20 flex items-center justify-center">
                <div className="w-20 h-5 bg-foreground/30 rounded-full" />
              </div>
              <div className="pt-10 px-4 pb-4 h-full flex flex-col">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xs">EV</span>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="h-32 rounded-xl bg-gradient-to-br from-accent/30 to-gold/30 shimmer" />
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 rounded-lg bg-foreground/10" />
                    ))}
                  </div>
                  <div className="h-24 rounded-xl bg-foreground/10" />
                  <div className="h-24 rounded-xl bg-foreground/10" />
                </div>
              </div>
            </div>
            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-20 -left-4 px-3 py-2 rounded-xl bg-card shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-gold fill-gold" />
                <span className="text-sm font-semibold text-foreground">4.8 Rating</span>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute bottom-32 -right-4 px-3 py-2 rounded-xl bg-card shadow-lg"
            >
              <span className="text-sm font-semibold text-foreground">5M+ Downloads</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
