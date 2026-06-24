import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Ticket, Mail, KeyRound, RotateCw } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

type Step = "request" | "verify";

const RESEND_COOLDOWN_SECONDS = 60;
const MAX_VERIFY_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

type AttemptState = { count: number; lockedUntil: number };

const attemptKey = (email: string) => `fp_attempts:${email.trim().toLowerCase()}`;

const readAttempts = (email: string): AttemptState => {
  try {
    const raw = localStorage.getItem(attemptKey(email));
    if (!raw) return { count: 0, lockedUntil: 0 };
    return JSON.parse(raw);
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
};

const writeAttempts = (email: string, state: AttemptState) => {
  try {
    localStorage.setItem(attemptKey(email), JSON.stringify(state));
  } catch {}
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Tick once per second for cooldown + lockout countdowns
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setCooldown((s) => (s > 0 ? s - 1 : 0));
      if (email) {
        const { lockedUntil } = readAttempts(email);
        const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
        setLockSecondsLeft(remaining);
      }
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [email]);

  const startCooldown = () => setCooldown(RESEND_COOLDOWN_SECONDS);

  const requestCode = async (targetEmail: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
      redirectTo: `${window.location.origin}/auth`,
    });
    if (error) throw error;
  };

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setIsLoading(true);
    try {
      await requestCode(parsed.data);
      // reset any prior attempt counter on a fresh request
      writeAttempts(parsed.data, { count: 0, lockedUntil: 0 });
      toast.success("We sent a 6-digit code to your email");
      setStep("verify");
      startCooldown();
    } catch (err: any) {
      toast.error(err?.message || "Could not send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (cooldown > 0 || isLoading) return;
    setIsLoading(true);
    try {
      await requestCode(email);
      toast.success("A new code has been sent");
      setOtp("");
      startCooldown();
    } catch (err: any) {
      toast.error(err?.message || "Could not resend code");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const state = readAttempts(email);
    if (state.lockedUntil > Date.now()) {
      toast.error("Too many attempts. Please wait before trying again.");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code from your email");
      return;
    }
    const pw = passwordSchema.safeParse(newPassword);
    if (!pw.success) {
      toast.error(pw.error.issues[0].message);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "recovery",
      });
      if (verifyError) throw verifyError;

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      // success — clear attempts
      writeAttempts(email, { count: 0, lockedUntil: 0 });
      await supabase.auth.signOut();
      toast.success("Password updated. Please sign in with your new password.");
      navigate("/auth");
    } catch (err: any) {
      const next = { ...state, count: state.count + 1 };
      const remaining = MAX_VERIFY_ATTEMPTS - next.count;
      if (remaining <= 0) {
        next.lockedUntil = Date.now() + LOCKOUT_MS;
        next.count = 0;
        writeAttempts(email, next);
        toast.error("Too many failed attempts. Locked for 5 minutes.");
      } else {
        writeAttempts(email, next);
        toast.error(
          `${err?.message || "Invalid or expired code"} — ${remaining} attempt${remaining === 1 ? "" : "s"} left`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isLocked = lockSecondsLeft > 0;


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex flex-col">
      <header className="p-4">
        <Link to="/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                <Ticket className="h-6 w-6" />
              </div>
              <span className="text-2xl font-display font-bold text-foreground">
                Event<span className="text-accent">Hub</span>
              </span>
            </Link>
            <p className="mt-2 text-muted-foreground">
              {step === "request"
                ? "Reset your password with a one-time code"
                : `Enter the code we sent to ${email}`}
            </p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                {step === "request" ? <Mail className="h-5 w-5" /> : <KeyRound className="h-5 w-5" />}
                {step === "request" ? "Forgot password" : "Verify & set new password"}
              </div>
            </CardHeader>
            <CardContent>
              {step === "request" ? (
                <form onSubmit={sendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending code...</>
                    ) : (
                      "Send reset code"
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={verifyAndReset} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>6-digit code</Label>
                      <button
                        type="button"
                        onClick={resendOtp}
                        disabled={cooldown > 0 || isLoading || isLocked}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
                      >
                        <RotateCw className="h-3 w-3" />
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isLoading || isLocked}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {isLocked && (
                      <p className="text-xs text-destructive text-center">
                        Too many failed attempts. Try again in {Math.floor(lockSecondsLeft / 60)}:
                        {String(lockSecondsLeft % 60).padStart(2, "0")}.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isLoading || isLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm new password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading || isLocked}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading || isLocked}>
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating password...</>
                    ) : (
                      "Update password"
                    )}
                  </Button>
                  <button
                    type="button"
                    onClick={() => { setStep("request"); setOtp(""); }}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    Use a different email
                  </button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
