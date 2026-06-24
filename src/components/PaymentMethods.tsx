import { Smartphone, Shield, Lock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  onCardDetailsChange?: (details: any) => void;
  onUpiIdChange?: (upiId: string) => void;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
}

export const PaymentMethods = ({
  selectedMethod,
  onMethodChange,
  termsAccepted,
  onTermsChange,
}: PaymentMethodsProps) => {
  // Force UPI as the only method
  if (selectedMethod !== 'upi') {
    onMethodChange('upi');
  }

  return (
    <div className="space-y-4">
      <Card className="border-accent ring-2 ring-accent/20">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-accent text-accent-foreground flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">UPI Payment via Razorpay</p>
              <p className="text-xs text-muted-foreground">
                Pay securely with any UPI app — Google Pay, PhonePe, Paytm, BHIM and more
              </p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-accent" />
          </div>

          <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
            {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay', 'Other UPI'].map((app) => (
              <div
                key={app}
                className="p-2 rounded-lg border border-border text-center bg-secondary/40"
              >
                <span className="text-xs font-medium text-foreground">{app}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 p-3 bg-success/10 rounded-lg">
            <Lock className="w-4 h-4 text-success" />
            <span className="text-xs text-success">
              Payment processed securely by Razorpay. We never store your UPI credentials.
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-start gap-2 p-3 bg-secondary/40 rounded-lg">
        <Shield className="w-4 h-4 text-accent mt-0.5" />
        <p className="text-xs text-muted-foreground">
          You'll be redirected to Razorpay's secure UPI checkout to complete the payment.
        </p>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(c) => onTermsChange(!!c)}
          className="mt-1"
        />
        <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
          I accept the terms & conditions and privacy policy
        </Label>
      </div>
    </div>
  );
};

export default PaymentMethods;
