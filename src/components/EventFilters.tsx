import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  value: string;
  label: string;
}

interface EventFiltersProps {
  categories?: FilterOption[];
  languages: FilterOption[];
  cities: FilterOption[];
  selectedCategory: string;
  selectedLanguage: string;
  selectedCity: string;
  onCategoryChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onClearAll: () => void;
  resultCount?: number;
}

export function EventFilters({
  categories,
  languages,
  cities,
  selectedCategory,
  selectedLanguage,
  selectedCity,
  onCategoryChange,
  onLanguageChange,
  onCityChange,
  onClearAll,
  resultCount,
}: EventFiltersProps) {
  const activeFilters = [
    selectedCategory !== "all" && { key: "category", label: selectedCategory.replace("_", " "), clear: () => onCategoryChange("all") },
    selectedLanguage !== "all" && { key: "language", label: selectedLanguage, clear: () => onLanguageChange("all") },
    selectedCity !== "all" && { key: "city", label: selectedCity, clear: () => onCityChange("all") },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-4 md:p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-accent" />
          <h3 className="font-display text-lg font-semibold text-foreground">Filters</h3>
          {typeof resultCount === "number" && (
            <span className="text-sm text-muted-foreground ml-2">
              ({resultCount} results)
            </span>
          )}
        </div>
        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="text-muted-foreground hover:text-foreground">
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Genre / Category</label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Language</label>
          <Select value={selectedLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="All Languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">City</label>
          <Select value={selectedCity} onValueChange={onCityChange}>
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filter badges */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {activeFilters.map((f) => (
            <Badge
              key={f.key}
              variant="secondary"
              className="capitalize gap-1 pl-3 pr-1.5 py-1 cursor-pointer hover:bg-destructive/10 transition-colors"
              onClick={f.clear}
            >
              {f.label}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
}
