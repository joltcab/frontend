import React from "react";
import { MessageCircle } from "lucide-react";
import { useAppearanceSettings } from "./useAppearanceSettings";

export default function WhatsAppButton() {
  const { general } = useAppearanceSettings();

  if (!general.show_whatsapp_button || !general.whatsapp_number) {
    return null;
  }

  const handleClick = () => {
    const url = `https://wa.me/${general.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%20JoltCab,%20I%20need%20assistance`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 animate-pulse"
      style={{ backgroundColor: general.primary_color || '#15B46A' }}
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </button>
  );
}