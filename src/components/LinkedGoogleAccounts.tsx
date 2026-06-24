import { useEffect } from 'react';
import { Link2, Plus, Trash2, Loader2, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLinkedAccounts, useUnlinkAccount } from '@/hooks/useLinkedAccounts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { toast } from 'sonner';

const LINK_FLAG_KEY = 'pendingLinkPrimaryUserId';

export const LinkedGoogleAccounts = () => {
  const { user } = useAuth();
  const { data: links = [], isLoading, refetch } = useLinkedAccounts();
  const unlink = useUnlinkAccount();

  // After OAuth redirect-back, finalize a pending manual link.
  useEffect(() => {
    const finalize = async () => {
      const primaryId = sessionStorage.getItem(LINK_FLAG_KEY);
      if (!primaryId || !user) return;
      sessionStorage.removeItem(LINK_FLAG_KEY);

      if (user.id === primaryId) {
        toast.info('You signed in with the same account — nothing to link.');
        return;
      }

      const { error } = await supabase.from('linked_accounts').upsert(
        {
          primary_user_id: primaryId,
          linked_user_id: user.id,
          linked_email: user.email ?? '',
          provider: 'google',
        },
        { onConflict: 'linked_user_id' },
      );

      if (error) {
        toast.error(error.message || 'Failed to link account');
      } else {
        toast.success(`Linked ${user.email} to your profile`);
        refetch();
      }
    };
    finalize();
  }, [user, refetch]);

  const handleLinkAnother = async () => {
    if (!user) return;
    sessionStorage.setItem(LINK_FLAG_KEY, user.id);
    try {
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.href,
        extraParams: { prompt: 'select_account' },
      });
      if (result.error) {
        sessionStorage.removeItem(LINK_FLAG_KEY);
        toast.error(result.error.message || 'Google sign-in failed');
      }
    } catch (err) {
      sessionStorage.removeItem(LINK_FLAG_KEY);
      toast.error('Failed to start Google sign-in');
    }
  };

  return (
    <Card className="bg-card lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Link2 className="w-5 h-5 text-accent" />
          Linked Google Accounts
        </CardTitle>
        <CardDescription>
          Sign in with multiple Gmail addresses tied to the same profile. Accounts with a
          matching email are linked automatically; use the button below to attach a different
          Gmail.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : links.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">
            No additional Google accounts linked yet.
          </p>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between p-3 border border-border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{link.linked_email}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {link.provider} · linked {new Date(link.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => unlink.mutate(link.id)}
                disabled={unlink.isPending}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))
        )}

        <Button onClick={handleLinkAnother} variant="outline" className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Link another Google account
        </Button>
      </CardContent>
    </Card>
  );
};
