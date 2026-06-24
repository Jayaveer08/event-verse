// Razorpay checkout helper - UPI only

declare global {
  interface Window {
    Razorpay: any;
  }
}

let scriptPromise: Promise<void> | null = null;

export const loadRazorpayScript = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.reject('No window');
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Failed to load Razorpay checkout'));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
};

export interface RazorpayUpiOptions {
  keyId: string;
  orderId: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
}

export interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const openRazorpayUpiCheckout = (
  opts: RazorpayUpiOptions
): Promise<RazorpaySuccess> => {
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: opts.keyId,
      order_id: opts.orderId,
      amount: opts.amount,
      currency: opts.currency,
      name: opts.name,
      description: opts.description,
      prefill: opts.prefill,
      notes: opts.notes,
      // Prefer UPI but allow all enabled methods on the account so test mode works
      // (UPI may not be activated on test accounts; falls back to cards/netbanking).
      config: {
        display: {
          blocks: {
            upi_block: {
              name: 'Pay using UPI',
              instruments: [{ method: 'upi' }],
            },
          },
          sequence: ['block.upi_block'],
          preferences: { show_default_blocks: true },
        },
      },
      theme: { color: '#0f766e' },
      handler: (response: RazorpaySuccess) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
    });
    rzp.on('payment.failed', (resp: any) => {
      reject(new Error(resp?.error?.description || 'Payment failed'));
    });
    rzp.open();
  });
};
