import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, MapPin, Calendar, Clock, Star, Users, 
  CreditCard, Smartphone, Wallet, Building2, Loader2, 
  Check, ExternalLink, Shield, Mail, Info, MessageSquare,
  Plus, Minus, Languages, BadgeCheck, TrendingUp, Ticket,
  FileText, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PaymentMethods } from "@/components/PaymentMethods";
import { useEvent } from "@/hooks/useEvents";
import { useCreateBooking } from "@/hooks/useBookings";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { loadRazorpayScript, openRazorpayUpiCheckout } from "@/lib/razorpay";
import { downloadBookingReceipt, viewBookingReceipt } from "@/lib/bookingReceipt";

// Ticket types with pricing tiers
const ticketTiers = [
  { 
    id: 'standard', 
    name: 'Day Pass', 
    description: 'Single day access',
    priceMultiplier: 1,
    available: 3500
  },
  { 
    id: 'weekend', 
    name: 'Weekend Pass', 
    description: 'All 3 days access',
    priceMultiplier: 1.8,
    available: 1800
  },
  { 
    id: 'vip', 
    name: 'VIP Pass', 
    description: 'Priority entry + exclusive merch',
    priceMultiplier: 3.5,
    available: 220
  },
];

type BookingStep = 'details' | 'checkout' | 'confirmation';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: event, isLoading, error } = useEvent(eventId || '');
  const createBooking = useCreateBooking();

  const [step, setStep] = useState<BookingStep>('details');
  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({
    standard: 0,
    weekend: 0,
    vip: 0,
  });
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [contactDetails, setContactDetails] = useState({
    fullName: '',
    phone: '',
    email: '',
  });

  // Pre-fill contact details from profile
  useEffect(() => {
    if (profile) {
      setContactDetails({
        fullName: profile.full_name || '',
        phone: profile.phone || '',
        email: profile.email || '',
      });
    }
  }, [profile]);

  const basePrice = event?.price_min || 799;
  
  const calculateSubtotal = () => {
    return ticketTiers.reduce((total, tier) => {
      return total + (ticketQuantities[tier.id] * Math.round(basePrice * tier.priceMultiplier));
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const convenienceFee = subtotal > 0 ? 30 : 0;
  const gst = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + convenienceFee + gst;
  const totalTickets = Object.values(ticketQuantities).reduce((a, b) => a + b, 0);

  const updateTicketQuantity = (tierId: string, delta: number) => {
    setTicketQuantities(prev => ({
      ...prev,
      [tierId]: Math.max(0, Math.min(10, prev[tierId] + delta))
    }));
  };

  const handleProceedToCheckout = () => {
    if (totalTickets === 0) {
      toast.error('Please select at least one ticket');
      return;
    }
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/auth');
      return;
    }
    setStep('checkout');
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/auth');
      return;
    }

    if (!event || totalTickets === 0) return;

    // Validate contact details
    if (!contactDetails.fullName || !contactDetails.email) {
      toast.error('Please fill in your contact details');
      return;
    }

    // Validate terms acceptance
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsBooking(true);
    try {
      // Generate seat numbers based on ticket types
      const seatNumbers = ticketTiers.flatMap(tier => {
        const qty = ticketQuantities[tier.id];
        return Array.from({ length: qty }, (_, i) => `${tier.name.charAt(0)}${i + 1}`);
      });

      // 1. Create Razorpay order via edge function
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'razorpay-create-order',
        { body: { amount: totalAmount } }
      );
      if (orderError || !orderData?.orderId) {
        throw new Error(orderError?.message || 'Failed to create payment order');
      }

      // 2. Load Razorpay checkout and open UPI-only modal
      await loadRazorpayScript();
      const result = await openRazorpayUpiCheckout({
        keyId: orderData.keyId,
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'EventVerse India',
        description: event.title,
        prefill: {
          name: contactDetails.fullName,
          email: contactDetails.email,
          contact: contactDetails.phone,
        },
        notes: { eventId: event.id },
      });

      // 3. Verify signature server-side
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
        'razorpay-verify-payment',
        { body: result }
      );
      if (verifyError || !verifyData?.verified) {
        throw new Error('Payment verification failed');
      }

      // 4. Create booking record
      const newBooking = await createBooking.mutateAsync({
        eventId: event.id,
        numTickets: totalTickets,
        totalAmount,
        paymentMethod: 'upi',
        seatNumbers,
      });
      setConfirmedBooking({ ...newBooking, event });
      setStep('confirmation');
    } catch (err: any) {
      console.error('Booking failed:', err);
      toast.error(err?.message || 'Payment failed');
    } finally {
      setIsBooking(false);
    }
  };

  // Map extended payment methods to database enum
  const mapPaymentMethod = (method: string): 'upi' | 'credit_card' | 'debit_card' | 'wallet' | 'net_banking' => {
    const upiMethods = ['upi', 'gpay', 'phonepe', 'paytm', 'amazonpay', 'bhim', 'whatsapp'];
    const walletMethods = ['wallet', 'paytm_wallet', 'phonepe_wallet', 'amazonpay_wallet', 'mobikwik', 'freecharge'];
    const bankTransferMethods = ['bank_transfer', 'neft', 'rtgs', 'imps'];
    
    if (upiMethods.includes(method)) return 'upi';
    if (method === 'credit_card') return 'credit_card';
    if (method === 'debit_card') return 'debit_card';
    if (walletMethods.includes(method)) return 'wallet';
    if (method === 'net_banking' || bankTransferMethods.includes(method)) return 'net_banking';
    return 'upi'; // default
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-8">The event you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(event.start_date).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = new Date(event.start_date).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Confirmation view
  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-success-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground mb-8">
              Your tickets for <span className="font-semibold text-foreground">{event.title}</span> have been booked successfully.
            </p>
            
            <Card className="text-left mb-8">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tickets</span>
                  <span className="font-medium text-foreground">{totalTickets} ticket(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-foreground">{formattedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue</span>
                  <span className="font-medium text-foreground">{event.venue?.name}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-4">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="text-xl font-bold text-foreground">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="hero"
                onClick={() => confirmedBooking && downloadBookingReceipt(confirmedBooking)}
                disabled={!confirmedBooking}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Ticket
              </Button>
              <Button
                variant="outline"
                onClick={() => confirmedBooking && viewBookingReceipt(confirmedBooking)}
                disabled={!confirmedBooking}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Receipt
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                My Bookings
              </Button>
              <Button onClick={() => navigate('/')}>
                Browse More
              </Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  // Checkout view
  if (step === 'checkout') {
    return (
      <div className="min-h-screen bg-muted/50">
        <Header />
        
        {/* Checkout Header */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <button 
              onClick={() => setStep('details')}
              className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <div>
                <h1 className="font-semibold">Checkout</h1>
                <p className="text-sm text-muted-foreground">Secure payment</p>
              </div>
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Summary */}
              <Card className="bg-card">
                <CardContent className="p-4 flex gap-4">
                  <img 
                    src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=80'}
                    alt={event.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{event.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      <span>{formattedDate} • {formattedTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      <span>{event.venue?.name}, {event.venue?.city}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Select Tickets */}
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-accent text-lg">🎟️</span>
                    <h3 className="font-semibold text-foreground">Select Tickets</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {ticketTiers.map((tier) => {
                      const price = Math.round(basePrice * tier.priceMultiplier);
                      const isSelected = ticketQuantities[tier.id] > 0;
                      
                      return (
                        <div 
                          key={tier.id}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            isSelected 
                              ? 'border-accent bg-accent/5' 
                              : 'border-border hover:border-accent/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{tier.name}</h4>
                              <p className="text-sm text-accent">{tier.description}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {tier.available} remaining
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-foreground text-lg">₹{price.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-3 mt-3">
                            <button
                              onClick={() => updateTicketQuantity(tier.id, -1)}
                              disabled={ticketQuantities[tier.id] === 0}
                              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className={`w-8 text-center font-semibold ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                              {ticketQuantities[tier.id]}
                            </span>
                            <button
                              onClick={() => updateTicketQuantity(tier.id, 1)}
                              disabled={ticketQuantities[tier.id] >= 10}
                              className="w-8 h-8 rounded-lg border border-accent bg-accent/10 flex items-center justify-center text-accent hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Details */}
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Contact Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium text-foreground">Full Name</Label>
                      <Input 
                        id="fullName"
                        placeholder="Your name"
                        value={contactDetails.fullName}
                        onChange={(e) => setContactDetails(prev => ({ ...prev, fullName: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</Label>
                      <Input 
                        id="phone"
                        placeholder="+91 9876543210"
                        value={contactDetails.phone}
                        onChange={(e) => setContactDetails(prev => ({ ...prev, phone: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={contactDetails.email}
                      onChange={(e) => setContactDetails(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                    />
                    <p className="text-xs text-accent mt-1">Tickets will be sent to this email</p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods - Comprehensive */}
              <Card className="bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-accent" />
                    Payment Method
                  </h3>
                  <PaymentMethods
                    selectedMethod={paymentMethod}
                    onMethodChange={setPaymentMethod}
                    termsAccepted={termsAccepted}
                    onTermsChange={setTermsAccepted}
                  />
                </CardContent>
              </Card>

              {/* Special Requests */}
              <Card className="bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    Special Requests (Optional)
                  </h3>
                  <Textarea
                    placeholder="Any dietary requirements, accessibility needs, or other special requests..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
                  
                  <div className="space-y-3">
                    {ticketTiers.filter(t => ticketQuantities[t.id] > 0).map(tier => (
                      <div key={tier.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{tier.name} × {ticketQuantities[tier.id]}</span>
                        <span className="font-medium text-foreground">
                          ₹{(ticketQuantities[tier.id] * Math.round(basePrice * tier.priceMultiplier)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                    
                    <div className="border-t border-border pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Convenience Fee</span>
                        <span className="text-foreground">₹{convenienceFee}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">GST (18%)</span>
                        <span className="text-foreground">₹{gst.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="text-2xl font-bold text-foreground">₹{totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                    size="lg"
                    onClick={handleBooking}
                    disabled={isBooking || totalTickets === 0}
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Pay ₹{totalAmount.toLocaleString('en-IN')} →</>
                    )}
                  </Button>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4 text-success" />
                      <span>Secure SSL encrypted payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-4 h-4 text-success" />
                      <span>Instant e-ticket on your email</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Main Event Detail view
  return (
    <div className="min-h-screen bg-muted/50">
      <Header />

      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[300px]">
        <div className="absolute inset-0">
          <img
            src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-between py-6">
          {/* Back Navigation Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              // Try to go back in history, fallback to home if no history
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Events</span>
          </motion.button>

          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                {event.category.replace('_', ' ').charAt(0).toUpperCase() + event.category.replace('_', ' ').slice(1)}
              </span>
              {event.is_featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-light text-primary-foreground text-xs font-semibold">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified Organizer
                </span>
              )}
              {event.is_trending && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Trending
                </span>
              )}
            </div>

            {/* Title & Attendees */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              {event.title}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <Users className="w-4 h-4" />
              <span className="text-sm">{event.review_count || 0}+ attending</span>
            </div>
          </div>
        </div>
      </section>

      {/* Date/Time & Venue Bar */}
      <section className="container mx-auto px-4 -mt-4 relative z-10 mb-6">
        <div className="bg-card rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-4 flex-1 p-3 rounded-xl bg-accent/10 border border-accent/20">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <Calendar className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date & Time</p>
              <p className="font-semibold text-foreground">{formattedDate}</p>
              <p className="text-sm text-muted-foreground">{formattedTime}</p>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue?.name || ''} ${event.venue?.address || ''} ${event.venue?.city || ''}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 flex-1 p-3 rounded-xl bg-secondary border border-border hover:border-accent/50 transition-colors group/venue"
          >
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <MapPin className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Venue</p>
              <p className="font-semibold text-foreground group-hover/venue:text-accent transition-colors">{event.venue?.name || 'Venue TBA'}</p>
              <p className="text-sm text-muted-foreground">{event.venue?.city}, {event.venue?.state}</p>
            </div>
            <ExternalLink className="w-5 h-5 text-accent" />
          </a>
        </div>
      </section>

      {/* Venue Map */}
      {event.venue && (
        <section className="container mx-auto px-4 mb-6">
          <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
            <div className="p-4 flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                Venue Location
              </h3>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue.name} ${event.venue.address} ${event.venue.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline flex items-center gap-1"
              >
                Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <iframe
              title="Venue Location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(`${event.venue.name} ${event.venue.address} ${event.venue.city}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-64 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: About & Reviews */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="bg-white border border-border w-auto inline-flex mb-6">
                <TabsTrigger value="about" className="flex items-center gap-2 data-[state=active]:bg-accent/10 data-[state=active]:text-accent">
                  <Info className="w-4 h-4" />
                  About
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-2 data-[state=active]:bg-accent/10 data-[state=active]:text-accent">
                  <MessageSquare className="w-4 h-4" />
                  Reviews ({event.review_count || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground text-lg mb-4">About This Event</h3>
                    
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <p>{event.description || "Join us for an unforgettable experience! This event promises to be filled with excitement, entertainment, and memories that will last a lifetime."}</p>
                      
                      <h4 className="text-foreground font-semibold mt-6 mb-2">Highlights:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Live performances and entertainment</li>
                        <li>Interactive experiences</li>
                        <li>Food and beverages available</li>
                        <li>Meet other enthusiasts</li>
                        <li>Exclusive merchandise</li>
                      </ul>

                      {event.age_restriction && (
                        <p className="text-foreground mt-4">
                          <strong>Age Restriction:</strong> {event.age_restriction}
                        </p>
                      )}
                    </div>

                    {/* Languages */}
                    {event.languages && event.languages.length > 0 && (
                      <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
                        <Languages className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Languages:</span>
                        {event.languages.map((lang, idx) => (
                          <span key={idx} className="text-sm text-accent font-medium">{lang}{idx < event.languages!.length - 1 ? ',' : ''}</span>
                        ))}
                      </div>
                    )}

                    {/* Organizer */}
                    <div className="mt-6 pt-4 border-t border-border">
                      <h4 className="font-semibold text-foreground mb-3">Organized By</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold">
                          {event.title.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">Event Organizer</span>
                            <BadgeCheck className="w-4 h-4 text-teal-light" />
                          </div>
                          <p className="text-sm text-muted-foreground">Event Organizer</p>
                        </div>
                      </div>
                    </div>

                    {/* Refund Policy */}
                    <div className="mt-6 pt-4 border-t border-border">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-destructive mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-foreground">Refund Policy</h4>
                          <p className="text-sm text-muted-foreground">No refunds. Tickets are transferable.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="bg-card">
                  <CardContent className="p-6">
                    {event.rating && event.rating > 0 ? (
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-4xl font-bold text-foreground">{event.rating.toFixed(1)}</div>
                        <div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-5 h-5 ${star <= Math.round(event.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{event.review_count || 0} reviews</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No reviews yet. Be the first to review after attending!</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Ticket Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground text-lg mb-4">Select Tickets</h3>
                
                <div className="space-y-4">
                  {ticketTiers.map((tier) => {
                    const price = Math.round(basePrice * tier.priceMultiplier);
                    const isSelected = ticketQuantities[tier.id] > 0;
                    
                    return (
                      <div 
                        key={tier.id}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isSelected 
                            ? 'border-accent bg-accent/5' 
                            : 'border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-foreground">{tier.name}</h4>
                            <p className="text-sm text-muted-foreground">{tier.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{tier.available} available</p>
                          </div>
                          <p className="font-bold text-foreground">₹{price.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => updateTicketQuantity(tier.id, -1)}
                            disabled={ticketQuantities[tier.id] === 0}
                            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className={`w-6 text-center font-semibold ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                            {ticketQuantities[tier.id]}
                          </span>
                          <button
                            onClick={() => updateTicketQuantity(tier.id, 1)}
                            disabled={ticketQuantities[tier.id] >= 10}
                            className="w-8 h-8 rounded-lg border border-accent bg-accent/10 flex items-center justify-center text-accent hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <span className="text-muted-foreground">{totalTickets} ticket(s)</span>
                  <span className="text-xl font-bold text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <Button 
                  className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
                  size="lg"
                  onClick={handleProceedToCheckout}
                  disabled={totalTickets === 0}
                >
                  Proceed to Checkout →
                </Button>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4 text-success" />
                    <span>Secure payment with 256-bit SSL</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="w-4 h-4 text-success" />
                    <span>Instant confirmation via email & SMS</span>
                  </div>
                </div>

                {!user && (
                  <p className="text-center text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                    <Link to="/auth" className="text-accent hover:underline">Login</Link> to complete booking
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetail;
