import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { uploadBookingReceipt } from '@/lib/bookingReceipt';

export interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  booking_date: string;
  num_tickets: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  payment_method: string | null;
  payment_id: string | null;
  seat_numbers: string[] | null;
  created_at: string;
  event?: any;
}

export const useBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          event:events(
            *,
            venue:venues(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user,
  });
};

export const useCreateBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      numTickets,
      totalAmount,
      paymentMethod,
      seatNumbers,
    }: {
      eventId: string;
      numTickets: number;
      totalAmount: number;
      paymentMethod: string;
      seatNumbers?: string[];
    }) => {
      if (!user) throw new Error('Must be logged in');

      // Map payment method to valid enum value
      const validPaymentMethods = ['upi', 'credit_card', 'debit_card', 'wallet', 'net_banking'] as const;
      const dbPaymentMethod = validPaymentMethods.includes(paymentMethod as any) 
        ? (paymentMethod as typeof validPaymentMethods[number])
        : 'upi';

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          event_id: eventId,
          num_tickets: numTickets,
          total_amount: totalAmount,
          payment_method: dbPaymentMethod,
          seat_numbers: seatNumbers || null,
          status: 'confirmed',
        })
        .select(`*, event:events(*, venue:venues(*))`)
        .single();

      if (error) throw error;

      // Generate + securely store the INR receipt PDF for this confirmed booking
      await uploadBookingReceipt(data, user.id);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Booking confirmed! Check your email for details.');
    },
    onError: (error) => {
      toast.error('Failed to create booking');
      console.error(error);
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking cancelled successfully');
    },
    onError: (error) => {
      toast.error('Failed to cancel booking');
      console.error(error);
    },
  });
};
