import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Tag,
  IndianRupee,
  Clock,
  Users,
  Upload,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useVenues } from "@/hooks/useEvents";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Constants } from "@/integrations/supabase/types";

const STEPS = ["Basic Info", "Date & Venue", "Pricing & Capacity", "Media & Tags"];

const CATEGORIES = Constants.public.Enums.event_category;

const LANGUAGES = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam",
  "Bengali", "Marathi", "Gujarati", "Punjabi",
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { data: venues } = useVenues();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "" as string,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    durationMinutes: 120,
    venueId: "",
    priceMin: 0,
    priceMax: 0,
    totalSeats: 100,
    isFeatured: false,
    isTrending: false,
    languages: [] as string[],
    ageRestriction: "",
    tags: "",
  });

  const updateForm = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleLanguage = (lang: string) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.title.trim() && form.category && form.description.trim();
      case 1:
        return form.startDate && form.startTime && form.endDate && form.endTime;
      case 2:
        return form.priceMin >= 0 && form.priceMax >= form.priceMin && form.totalSeats > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    try {
      let imageUrl: string | null = null;

      // Upload image if provided
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("event-images")
          .upload(path, imageFile);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("event-images")
          .getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const startDate = new Date(`${form.startDate}T${form.startTime}`).toISOString();
      const endDate = new Date(`${form.endDate}T${form.endTime}`).toISOString();

      const { error } = await supabase.from("events").insert({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category as any,
        venue_id: form.venueId || null,
        start_date: startDate,
        end_date: endDate,
        duration_minutes: form.durationMinutes,
        price_min: form.priceMin,
        price_max: form.priceMax,
        total_seats: form.totalSeats,
        available_seats: form.totalSeats,
        is_featured: form.isFeatured,
        is_trending: form.isTrending,
        image_url: imageUrl,
        languages: form.languages.length > 0 ? form.languages : null,
        age_restriction: form.ageRestriction || null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
        created_by: user.id,
      });

      if (error) throw error;

      toast({
        title: "Event Created! 🎉",
        description: "Your event has been published successfully.",
      });
      navigate("/events");
    } catch (err: any) {
      toast({
        title: "Error creating event",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 container mx-auto px-4 text-center py-20">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Sign In Required
          </h1>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to create an event.
          </p>
          <Button variant="accent" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Create New Event
            </h1>
            <p className="text-muted-foreground mt-2">
              Fill in the details to publish your event on EventVerse India.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-10">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    i === step
                      ? "text-accent"
                      : i < step
                      ? "text-primary cursor-pointer"
                      : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      i === step
                        ? "border-accent bg-accent text-accent-foreground"
                        : i < step
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </span>
                  <span className="hidden md:inline">{label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded ${
                      i < step ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm"
            >
              {step === 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-accent mb-2">
                    <Tag className="w-5 h-5" />
                    <span className="font-semibold">Basic Information</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Mumbai Music Festival 2026"
                      value={form.title}
                      onChange={(e) => updateForm("title", e.target.value)}
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) => updateForm("category", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your event..."
                      rows={5}
                      value={form.description}
                      onChange={(e) => updateForm("description", e.target.value)}
                      maxLength={2000}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {form.description.length}/2000
                    </p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-accent mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">Date, Time & Venue</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => updateForm("startDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Time *</Label>
                      <Input
                        type="time"
                        value={form.startTime}
                        onChange={(e) => updateForm("startTime", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date *</Label>
                      <Input
                        type="date"
                        value={form.endDate}
                        onChange={(e) => updateForm("endDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time *</Label>
                      <Input
                        type="time"
                        value={form.endTime}
                        onChange={(e) => updateForm("endTime", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={form.durationMinutes}
                      onChange={(e) => updateForm("durationMinutes", parseInt(e.target.value) || 0)}
                      min={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Venue</Label>
                    <Select
                      value={form.venueId}
                      onValueChange={(v) => updateForm("venueId", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a venue (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {venues?.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            {venue.name} — {venue.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-accent mb-2">
                    <IndianRupee className="w-5 h-5" />
                    <span className="font-semibold">Pricing & Capacity</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Min Price (₹) *</Label>
                      <Input
                        type="number"
                        value={form.priceMin}
                        onChange={(e) => updateForm("priceMin", parseInt(e.target.value) || 0)}
                        min={0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Price (₹) *</Label>
                      <Input
                        type="number"
                        value={form.priceMax}
                        onChange={(e) => updateForm("priceMax", parseInt(e.target.value) || 0)}
                        min={0}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Total Seats *</Label>
                    <Input
                      type="number"
                      value={form.totalSeats}
                      onChange={(e) => updateForm("totalSeats", parseInt(e.target.value) || 0)}
                      min={1}
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={form.isFeatured}
                        onCheckedChange={(v) => updateForm("isFeatured", v)}
                      />
                      <Label>Featured Event</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={form.isTrending}
                        onCheckedChange={(v) => updateForm("isTrending", v)}
                      />
                      <Label>Trending Event</Label>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Set price to ₹0 for free events. Featured and trending events get more visibility.
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-accent mb-2">
                    <ImageIcon className="w-5 h-5" />
                    <span className="font-semibold">Media & Tags</span>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label>Event Image</Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-accent transition-colors">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload an event image
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 5MB
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="space-y-2">
                    <Label>Languages</Label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleLanguage(lang)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            form.languages.includes(lang)
                              ? "bg-accent text-accent-foreground border-accent"
                              : "bg-card text-muted-foreground border-border hover:border-accent"
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age Restriction */}
                  <div className="space-y-2">
                    <Label>Age Restriction</Label>
                    <Select
                      value={form.ageRestriction}
                      onValueChange={(v) => updateForm("ageRestriction", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="No restriction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Restriction</SelectItem>
                        <SelectItem value="5+">5+</SelectItem>
                        <SelectItem value="12+">12+</SelectItem>
                        <SelectItem value="16+">16+</SelectItem>
                        <SelectItem value="18+">18+</SelectItem>
                        <SelectItem value="21+">21+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label>Tags (comma separated)</Label>
                    <Input
                      placeholder="e.g. live-music, outdoor, family-friendly"
                      value={form.tags}
                      onChange={(e) => updateForm("tags", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                variant="accent"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="accent"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Event"
                )}
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateEvent;
