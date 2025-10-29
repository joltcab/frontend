import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import MapWrapper from "../maps/MapWrapper";

export default function DispatcherMap({ rides }) {
  const [mapCenter, setMapCenter] = useState({ lat: 33.7490, lng: -84.3880 }); // Atlanta default

  useEffect(() => {
    if (rides && rides.length > 0) {
      // Center on first ride
      const firstRide = rides[0];
      if (firstRide.pickup_lat && firstRide.pickup_lng) {
        setMapCenter({
          lat: firstRide.pickup_lat,
          lng: firstRide.pickup_lng
        });
      }
    }
  }, [rides]);

  const markers = rides
    .filter(r => r.pickup_lat && r.pickup_lng)
    .map(ride => ({
      lat: ride.pickup_lat,
      lng: ride.pickup_lng,
      label: ride.passenger_email,
      color: ride.status === 'accepted' ? 'blue' : 'green'
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-[#15B46A]" />
          Live Rides Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] rounded-lg overflow-hidden">
          <MapWrapper
            center={mapCenter}
            zoom={12}
            markers={markers}
          />
        </div>
      </CardContent>
    </Card>
  );
}