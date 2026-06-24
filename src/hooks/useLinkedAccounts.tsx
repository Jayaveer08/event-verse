import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface LinkedAccount {
  id: string;
  primary_user_id: string;
  linked_user_id: string;
  linked_email: string;
  provider: string;
  created_at: string;
}

export const useLinkedAccounts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['linked-accounts', user?.id],
    queryFn: async () => {
      if (!user) return [] as LinkedAccount[];
      const { data, error } = await supabase
        .from('linked_accounts')
        .select('*')
        .or(`primary_user_id.eq.${user.id},linked_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as LinkedAccount[];
    },
    enabled: !!user,
  });
};

export const useUnlinkAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('linked_accounts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linked-accounts'] });
      toast.success('Account unlinked');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to unlink'),
  });
};
