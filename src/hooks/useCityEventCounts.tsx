import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCityEventCounts = () => {
  return useQuery({
    queryKey: ['city-event-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('city, events(id)');

      if (error) throw error;

      const counts: Record<string, number> = {};
      for (const venue of data || []) {
        const city = venue.city;
        const eventCount = Array.isArray(venue.events) ? venue.events.length : 0;
        counts[city] = (counts[city] || 0) + eventCount;
      }
      return counts;
    },
  });
};
