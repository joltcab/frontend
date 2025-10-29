import React from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

export default function WazeIntegration({ pickup, dropoff }) {
  const openInWaze = () => {
    if (!dropoff) {
      alert('No hay destino definido');
      return;
    }

    // Waze deep link format
    const wazeUrl = `https://waze.com/ul?ll=${dropoff.lat},${dropoff.lng}&navigate=yes`;
    
    // Try to open Waze app, fallback to web
    window.location.href = wazeUrl;
    
    // Fallback to web version after 2 seconds if app doesn't open
    setTimeout(() => {
      window.open(wazeUrl, '_blank');
    }, 2000);
  };

  const openInGoogleMaps = () => {
    if (!dropoff) {
      alert('No hay destino definido');
      return;
    }

    const origin = pickup ? `${pickup.lat},${pickup.lng}` : '';
    const destination = `${dropoff.lat},${dropoff.lng}`;
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={openInWaze}
        variant="outline"
        className="flex-1"
      >
        <Navigation className="w-4 h-4 mr-2" />
        Abrir en Waze
      </Button>
      <Button
        onClick={openInGoogleMaps}
        variant="outline"
        className="flex-1"
      >
        <Navigation className="w-4 h-4 mr-2" />
        Google Maps
      </Button>
    </div>
  );
}