import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  category: string;
  venue_id: string | null;
  start_date: string;
  end_date: string;
  duration_minutes: number;
  price_min: number;
  price_max: number;
  image_url: string | null;
  languages: string[] | null;
  age_restriction: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_trending: boolean;
  total_seats: number;
  available_seats: number;
  rating: number;
  review_count: number;
  venue?: Venue;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  capacity: number;
  amenities: string[] | null;
  image_url: string | null;
}

export const useEvents = (filters?: {
  category?: string;
  city?: string;
  featured?: boolean;
  trending?: boolean;
  limit?: number;
  randomize?: boolean;
}) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select(`
          *,
          venue:venues(*)
        `)
        .order('start_date', { ascending: true });

      if (filters?.category) {
        query = query.eq('category', filters.category as any);
      }
      if (filters?.featured) {
        query = query.eq('is_featured', true);
      }
      if (filters?.trending) {
        query = query.eq('is_trending', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter by city if provided (through venue)
      let events = data as (Event & { venue: Venue })[];
      if (filters?.city) {
        events = events.filter(e => e.venue?.city === filters.city);
      }

      // Shuffle events for variety on each visit
      if (filters?.randomize) {
        events = events.sort(() => Math.random() - 0.5);
      }

      // Apply limit after shuffle
      if (filters?.limit) {
        events = events.slice(0, filters.limit);
      }

      return events;
    },
    staleTime: 0, // Always refetch for fresh randomization
  });
};

export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venue:venues(*)
        `)
        .eq('id', eventId)
        .maybeSingle();

      if (error) throw error;
      return data as Event & { venue: Venue };
    },
    enabled: !!eventId,
  });
};

export const useVenues = (city?: string) => {
  return useQuery({
    queryKey: ['venues', city],
    queryFn: async () => {
      let query = supabase.from('venues').select('*');
      
      if (city) {
        query = query.eq('city', city);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Venue[];
    },
  });
};
