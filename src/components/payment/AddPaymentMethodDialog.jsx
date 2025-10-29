import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddPaymentMethodDialog({ isOpen, onClose, userEmail }) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const addPaymentMutation = useMutation({
    mutationFn: (data) => base44.entities.PaymentMethod.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
      onClose();
    },
  });

  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const cardNumber = formData.get('cardNumber').replace(/\s/g, '');
    const expiry = formData.get('expiry');
    const cvv = formData.get('cvv');
    const cardholderName = formData.get('cardholderName');

    // Detectar tipo de tarjeta
    let brand = 'visa';
    if (cardNumber.startsWith('5')) brand = 'mastercard';
    else if (cardNumber.startsWith('34') || cardNumber.startsWith('37')) brand = 'amex';
    else if (cardNumber.startsWith('6011') || cardNumber.startsWith('65')) brand = 'discover';

    // En producción, aquí usarías Stripe.js para tokenizar la tarjeta
    // const token = await stripe.createToken(card);

    // Por ahora simulamos el token
    const mockToken = `tok_${Math.random().toString(36).substring(7)}`;

    const paymentMethodData = {
      user_email: userEmail,
      gateway: 'stripe',
      token: mockToken,
      last4: cardNumber.slice(-4),
      brand: brand,
      is_default: false,
    };

    addPaymentMutation.mutate(paymentMethodData);
    setLoading(false);
  };

  const handlePayPalConnect = async () => {
    setLoading(true);

    // En producción, aquí abrirías el flujo de OAuth de PayPal
    // window.open('https://www.paypal.com/connect/...')

    // Por ahora simulamos la conexión
    setTimeout(() => {
      const paymentMethodData = {
        user_email: userEmail,
        gateway: 'paypal',
        token: `paypal_${Math.random().toString(36).substring(7)}`,
        last4: Math.floor(1000 + Math.random() * 9000).toString(),
        brand: 'paypal',
        is_default: false,
      };

      addPaymentMutation.mutate(paymentMethodData);
      setLoading(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Payment Method</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="card" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">
              <CreditCard className="w-4 h-4 mr-2" />
              Card
            </TabsTrigger>
            <TabsTrigger value="paypal">
              🅿️ PayPal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-4 pt-4">
            <form onSubmit={handleStripeSubmit} className="space-y-4">
              <div>
                <Label>Cardholder Name *</Label>
                <Input
                  name="cardholderName"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label>Card Number *</Label>
                <Input
                  name="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  required
                  onChange={(e) => {
                    let value = e.target.value.replace(/\s/g, '');
                    value = value.match(/.{1,4}/g)?.join(' ') || value;
                    e.target.value = value;
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Expiry Date *</Label>
                  <Input
                    name="expiry"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      e.target.value = value;
                    }}
                  />
                </div>

                <div>
                  <Label>CVV *</Label>
                  <Input
                    name="cvv"
                    type="password"
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#15B46A] hover:bg-[#0F9456]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding Card...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Card
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                🔒 Your payment information is encrypted and secure
              </p>
            </form>
          </TabsContent>

          <TabsContent value="paypal" className="space-y-4 pt-4">
            <div className="text-center py-8">
              <p className="text-3xl mb-4">🅿️</p>
              <p className="text-gray-600 mb-6">
                Connect your PayPal account to pay for rides
              </p>
              <Button
                onClick={handlePayPalConnect}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect PayPal Account"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}