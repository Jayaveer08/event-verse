import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { useFavorites } from '@/hooks/useFavorites';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Ticket, 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Settings,
  CreditCard,
  Loader2,
  Download,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { downloadBookingReceipt, viewBookingReceipt, downloadStoredReceipt } from '@/lib/bookingReceipt';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const { data: favorites, isLoading: favoritesLoading } = useFavorites();
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const upcomingBookings = bookings?.filter(
    b => b.status === 'confirmed' && new Date(b.event?.start_date) > new Date()
  ) || [];
  
  const pastBookings = bookings?.filter(
    b => b.status === 'completed' || new Date(b.event?.start_date) < new Date()
  ) || [];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      confirmed: 'default',
      completed: 'secondary',
      cancelled: 'destructive',
      pending: 'outline',
      refunded: 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  Welcome back!
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Ticket className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-accent/10">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{favorites?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Saved Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-secondary">
                  <CreditCard className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pastBookings.length}</p>
                  <p className="text-sm text-muted-foreground">Past Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            {bookingsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Skeleton className="h-24 w-32 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-1/2" />
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : bookings?.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring events and book your first experience!
                  </p>
                  <Button asChild>
                    <Link to="/">Browse Events</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings?.map(booking => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 h-32 md:h-auto">
                          <img
                            src={booking.event?.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
                            alt={booking.event?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{booking.event?.title}</h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(booking.event?.start_date), 'PPP')}
                            </p>
                            <p className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {format(new Date(booking.event?.start_date), 'p')}
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {booking.event?.venue?.name}, {booking.event?.venue?.city}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {booking.num_tickets} ticket(s) • ₹{booking.total_amount.toLocaleString()}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            {favoritesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : favorites?.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Save events you're interested in to find them easily later.
                  </p>
                  <Button asChild>
                    <Link to="/">Explore Events</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites?.map(fav => (
                  <Card key={fav.id} className="overflow-hidden group">
                    <div className="relative h-48">
                      <img
                        src={fav.event?.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
                        alt={fav.event?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{fav.event?.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(fav.event?.start_date), 'PPP')}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {fav.event?.venue?.city}
                      </p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="font-semibold text-primary">
                          ₹{fav.event?.price_min?.toLocaleString()}
                        </span>
                        <Button size="sm">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="max-w-lg">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedBooking.event?.title}</DialogTitle>
                <DialogDescription>
                  Booking ID: <span className="font-mono">{selectedBooking.id.slice(0, 8).toUpperCase()}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event Date</span>
                  <span>{format(new Date(selectedBooking.event?.start_date), 'PPP p')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue</span>
                  <span className="text-right">
                    {selectedBooking.event?.venue?.name}<br />
                    <span className="text-xs text-muted-foreground">{selectedBooking.event?.venue?.address}, {selectedBooking.event?.venue?.city}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tickets</span>
                  <span>{selectedBooking.num_tickets}</span>
                </div>
                {selectedBooking.seat_numbers?.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seats</span>
                    <span className="font-mono">{selectedBooking.seat_numbers.join(', ')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="uppercase">{selectedBooking.payment_method || '—'}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold">Total Paid</span>
                  <span className="font-semibold">₹{selectedBooking.total_amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booked On</span>
                  <span>{format(new Date(selectedBooking.created_at), 'PPP')}</span>
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
                <Button variant="outline" onClick={() => viewBookingReceipt(selectedBooking)}>
                  <Eye className="h-4 w-4 mr-1" /> View Receipt
                </Button>
                <Button variant="outline" onClick={() => user && downloadStoredReceipt(selectedBooking, user.id)}>
                  <Download className="h-4 w-4 mr-1" /> Download PDF
                </Button>
                <Button onClick={() => { navigate(`/event/${selectedBooking.event_id}`); setSelectedBooking(null); }}>
                  View Event
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Dashboard;
