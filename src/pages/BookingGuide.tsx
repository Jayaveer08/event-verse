import { useState } from "react";
import { 
  UserPlus, Lock, CreditCard, Bell, Shield, Smartphone, 
  Mail, Check, ChevronRight, ExternalLink, HelpCircle,
  User, Settings, Phone, Key, Eye, EyeOff, Fingerprint,
  AlertTriangle, CheckCircle2, ArrowRight, Home
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const steps = [
  {
    id: 1,
    icon: UserPlus,
    title: "Account Creation",
    description: "Start by creating your EventsIndia account",
  },
  {
    id: 2,
    icon: User,
    title: "Profile Setup",
    description: "Complete your profile for personalized experience",
  },
  {
    id: 3,
    icon: CreditCard,
    title: "Payment Methods",
    description: "Add secure payment options for quick checkout",
  },
  {
    id: 4,
    icon: Shield,
    title: "Account Security",
    description: "Protect your account with advanced security",
  },
];

const BookingGuide = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="min-h-screen bg-muted/50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent via-accent/90 to-accent/80 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-accent-foreground">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Booking Account Setup Guide
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Complete step-by-step guide to create and set up your EventsIndia booking account
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </Button>
                </Link>
                <Link to="/">
                  <Button size="lg" variant="outline" className="gap-2 bg-transparent border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10">
                    <Home className="w-5 h-5" />
                    Browse Events
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="container mx-auto px-4 -mt-8 relative z-10 mb-12">
        <Card className="bg-card shadow-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`relative p-4 rounded-xl transition-all ${
                    activeStep === step.id 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted hover:bg-accent/10'
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <step.icon className={`w-8 h-8 ${activeStep === step.id ? '' : 'text-accent'}`} />
                    <span className="font-semibold text-sm">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 text-muted-foreground z-10" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Content Sections */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Section 1: Account Creation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: activeStep === 1 ? 1 : 0.5, y: 0 }}
            className={activeStep === 1 ? '' : 'hidden md:block'}
          >
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-accent" />
                  </div>
                  1. Account Creation Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <h4 className="text-foreground font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent" />
                    Required Personal Information
                  </h4>
                  <ul className="text-muted-foreground space-y-2 mt-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>Full Name</strong> - As it appears on your ID (for ticket verification)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>Email Address</strong> - Valid email for ticket delivery and notifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>Phone Number</strong> - Indian mobile number (+91) for OTP verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>Password</strong> - Secure password for account access</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="text-foreground font-semibold flex items-center gap-2 mb-3">
                    <Smartphone className="w-4 h-4 text-accent" />
                    Verification Steps
                  </h4>
                  <ol className="text-muted-foreground space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm flex items-center justify-center flex-shrink-0">1</span>
                      <span>Enter your mobile number and request OTP</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm flex items-center justify-center flex-shrink-0">2</span>
                      <span>Enter the 6-digit OTP sent via SMS</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm flex items-center justify-center flex-shrink-0">3</span>
                      <span>Verify your email by clicking the link sent to your inbox</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm flex items-center justify-center flex-shrink-0">4</span>
                      <span>Complete profile setup to activate your account</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
                  <h4 className="text-foreground font-semibold flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-warning" />
                    Password Requirements
                  </h4>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      Minimum 8 characters long
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      At least one uppercase letter (A-Z)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      At least one lowercase letter (a-z)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      At least one number (0-9)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      At least one special character (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 2: Profile Setup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: activeStep === 2 ? 1 : 0.5, y: 0 }}
            className={activeStep === 2 ? '' : 'hidden md:block'}
          >
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  2. Profile Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-foreground font-semibold mb-3">Essential Profile Fields</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-xl">
                      <h5 className="font-medium text-foreground mb-2">Basic Information</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Display Name</li>
                        <li>• Date of Birth (for age-restricted events)</li>
                        <li>• Gender (optional)</li>
                        <li>• Profile Photo</li>
                      </ul>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-xl">
                      <h5 className="font-medium text-foreground mb-2">Location & Preferences</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Preferred City (Mumbai, Delhi, Bangalore, etc.)</li>
                        <li>• Preferred Language (English, Hindi, Regional)</li>
                        <li>• Event Categories of Interest</li>
                        <li>• Notification Preferences</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-foreground font-semibold flex items-center gap-2 mb-3">
                    <Bell className="w-4 h-4 text-accent" />
                    Privacy & Notification Settings
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Booking confirmations, reminders, offers</p>
                      </div>
                      <div className="w-12 h-6 bg-accent rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">SMS Alerts</p>
                        <p className="text-sm text-muted-foreground">OTP, booking updates, event reminders</p>
                      </div>
                      <div className="w-12 h-6 bg-accent rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Real-time updates on mobile app</p>
                      </div>
                      <div className="w-12 h-6 bg-muted-foreground/30 rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 3: Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: activeStep === 3 ? 1 : 0.5, y: 0 }}
            className={activeStep === 3 ? '' : 'hidden md:block'}
          >
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-accent" />
                  </div>
                  3. Adding Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Smartphone className="w-6 h-6 text-accent" />
                      <h5 className="font-semibold text-foreground">UPI</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Link your UPI ID for instant payments</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• PhonePe, Google Pay, Paytm</li>
                      <li>• Bank UPI apps</li>
                      <li>• BHIM UPI</li>
                    </ul>
                  </div>
                  
                  <div className="border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <CreditCard className="w-6 h-6 text-accent" />
                      <h5 className="font-semibold text-foreground">Cards</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Save cards for quick checkout</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Visa, Mastercard, RuPay</li>
                      <li>• Credit & Debit Cards</li>
                      <li>• Tokenized for security</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                  <h4 className="text-foreground font-semibold flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-success" />
                    Security Features
                  </h4>
                  <ul className="text-muted-foreground text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                      <span><strong>256-bit SSL Encryption</strong> - All transactions are encrypted</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                      <span><strong>PCI DSS Compliant</strong> - We don't store your card details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                      <span><strong>RBI Guidelines</strong> - Tokenized card storage as per RBI norms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                      <span><strong>2FA Required</strong> - OTP verification for every transaction</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 4: Account Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: activeStep === 4 ? 1 : 0.5, y: 0 }}
            className={activeStep === 4 ? '' : 'hidden md:block'}
          >
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  4. Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-foreground font-semibold flex items-center gap-2 mb-3">
                    <Fingerprint className="w-4 h-4 text-accent" />
                    Two-Factor Authentication (2FA)
                  </h4>
                  <ol className="text-muted-foreground space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm flex items-center justify-center flex-shrink-0">1</span>
                      <span>Go to Settings → Security → Two-Factor Authentication</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm flex items-center justify-center flex-shrink-0">2</span>
                      <span>Choose SMS OTP or Authenticator App (Google Authenticator, Authy)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm flex items-center justify-center flex-shrink-0">3</span>
                      <span>Verify with your mobile number or scan QR code</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm flex items-center justify-center flex-shrink-0">4</span>
                      <span>Save backup codes in a secure location</span>
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="text-foreground font-semibold flex items-center gap-2 mb-3">
                    <Key className="w-4 h-4 text-accent" />
                    Account Recovery Options
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-xl">
                      <h5 className="font-medium text-foreground mb-2">Email Recovery</h5>
                      <p className="text-sm text-muted-foreground">Receive password reset link via email</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-xl">
                      <h5 className="font-medium text-foreground mb-2">Phone Recovery</h5>
                      <p className="text-sm text-muted-foreground">Get OTP on registered mobile number</p>
                    </div>
                  </div>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                  <h4 className="text-foreground font-semibold flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    Best Practices
                  </h4>
                  <ul className="text-muted-foreground text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      Never share your password or OTP with anyone
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      Always log out from shared devices
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      Review login activity regularly in Settings
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      Update your password every 3-6 months
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Getting Started Tips */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-success" />
                </div>
                Getting Started Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="first-booking">
                  <AccordionTrigger className="text-left">
                    How to Make Your First Booking
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <ol className="space-y-2">
                      <li><strong>1.</strong> Browse events by category, city, or date on the homepage</li>
                      <li><strong>2.</strong> Click on an event to view details, venue, and ticket options</li>
                      <li><strong>3.</strong> Select your preferred ticket type and quantity</li>
                      <li><strong>4.</strong> Click "Proceed to Checkout" and verify your contact details</li>
                      <li><strong>5.</strong> Choose payment method and complete the payment</li>
                      <li><strong>6.</strong> Receive e-tickets instantly via email and SMS</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="cancellation">
                  <AccordionTrigger className="text-left">
                    Understanding Cancellation Policies
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <ul className="space-y-2">
                      <li>• <strong>Full Refund:</strong> If event is cancelled by organizer</li>
                      <li>• <strong>Partial Refund:</strong> Cancellation 48+ hours before event (varies by event)</li>
                      <li>• <strong>No Refund:</strong> Cancellation within 24 hours of event</li>
                      <li>• <strong>Transfer:</strong> Most tickets are transferable to another person</li>
                      <li>• Check individual event pages for specific refund policies</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="support">
                  <AccordionTrigger className="text-left">
                    Customer Service & Support
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-accent" />
                        <span><strong>Helpline:</strong> 1800-XXX-XXXX (Toll-free, 9 AM - 9 PM IST)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-accent" />
                        <span><strong>Email:</strong> support@eventsindia.com</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-accent" />
                        <span><strong>Help Center:</strong> 24/7 self-service FAQs and guides</span>
                      </div>
                      <p className="text-sm mt-2">For booking-related queries, keep your booking ID handy.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/auth" className="flex-1">
                  <Button className="w-full gap-2" size="lg">
                    <UserPlus className="w-5 h-5" />
                    Create Your Account
                  </Button>
                </Link>
                <Link to="/" className="flex-1">
                  <Button variant="outline" className="w-full gap-2" size="lg">
                    <ExternalLink className="w-5 h-5" />
                    Explore Events
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookingGuide;
