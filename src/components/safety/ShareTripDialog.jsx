import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Share2, Copy, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ShareTripDialog({ ride, open, onOpenChange }) {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const trackingUrl = `${window.location.origin}/track-ride?ride_id=${ride?.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaSMS = async () => {
    if (!phoneNumber) {
      alert('Ingresa un número de teléfono');
      return;
    }

    setSending(true);
    try {
      await base44.functions.invoke('sendTripShareSMS', {
        phone: phoneNumber,
        tracking_url: trackingUrl,
        passenger_name: ride?.passenger_email,
        driver_name: ride?.driver_email,
      });
      
      alert('✅ Enlace enviado por SMS');
      setPhoneNumber("");
    } catch (error) {
      console.error('Error sharing trip:', error);
      alert('❌ Error al enviar SMS');
    } finally {
      setSending(false);
    }
  };

  const shareViaWhatsApp = () => {
    const message = `🚖 Estoy en un viaje con JoltCab. Rastréame en tiempo real: ${trackingUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Compartir Viaje
          </DialogTitle>
          <DialogDescription>
            Comparte tu viaje en tiempo real con contactos de confianza
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Copy Link */}
          <div>
            <Label>Enlace de Seguimiento</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={trackingUrl}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Send via SMS */}
          <div>
            <Label>Enviar por SMS</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="tel"
              />
              <Button
                onClick={shareViaSMS}
                disabled={sending || !phoneNumber}
              >
                {sending ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </div>

          {/* WhatsApp Share */}
          <Button
            onClick={shareViaWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Compartir por WhatsApp
          </Button>

          {/* Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">💡 Consejo:</span> Comparte siempre tus viajes con alguien de confianza, especialmente en viajes nocturnos.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}