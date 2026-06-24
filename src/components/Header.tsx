import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, MapPin, Search, User, Ticket, LogOut, LayoutDashboard, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navLinks = [
  { label: "Movies", href: "/movies" },
  { label: "Events", href: "/events" },
  { label: "Sports", href: "/events?category=sports" },
  { label: "Concerts", href: "/events?category=music" },
];

const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad"];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Ticket className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground hidden sm:block">
                Event<span className="text-accent">Verse</span>
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-muted-foreground hover:text-foreground font-medium transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* City Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent hover:bg-accent/90 transition-colors focus:outline-none">
                  <MapPin className="w-4 h-4 text-accent-foreground" />
                  <span className="text-sm font-semibold text-accent-foreground">{selectedCity}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-accent-foreground/70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44 bg-card border border-border shadow-lg z-[100]">
                {cities.map((city) => (
                  <DropdownMenuItem
                    key={city}
                    className={`cursor-pointer font-medium ${
                      selectedCity === city
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                    onClick={() => {
                      setSelectedCity(city);
                      navigate(`/city/${city.toLowerCase()}`);
                    }}
                  >
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Button */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="w-5 h-5" />
            </Button>

            {/* Create Event Button (logged-in only) */}
            {user && (
              <Button variant="outline" size="sm" className="hidden md:flex" asChild>
                <Link to="/create-event">
                  <Plus className="w-4 h-4" />
                  Create Event
                </Link>
              </Button>
            )}

            {/* User Menu / Sign In */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                        {getInitials(user.email || "U")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="accent" size="sm" className="hidden sm:flex" asChild>
                <Link to="/auth">
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t border-border bg-card"
        >
          <div className="container py-4 space-y-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 w-full px-3 py-2 rounded-lg bg-accent hover:bg-accent/90 transition-colors focus:outline-none">
                  <MapPin className="w-4 h-4 text-accent-foreground" />
                  <span className="text-sm font-semibold text-accent-foreground flex-1 text-left">{selectedCity}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-accent-foreground/70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44 bg-card border border-border shadow-lg z-[100]">
                {cities.map((city) => (
                  <DropdownMenuItem
                    key={city}
                    className={`cursor-pointer font-medium ${
                      selectedCity === city
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                    onClick={() => {
                      setSelectedCity(city);
                      navigate(`/city/${city.toLowerCase()}`);
                      setIsMenuOpen(false);
                    }}
                  >
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="block py-2 text-foreground font-medium hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/create-event"
                  className="block py-2 text-foreground font-medium hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Event
                </Link>
                <Link
                  to="/dashboard"
                  className="block py-2 text-foreground font-medium hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button variant="destructive" className="w-full" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="accent" className="w-full" asChild>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
