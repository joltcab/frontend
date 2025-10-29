import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import LiveTrackingMap from "./LiveTrackingMap";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PassengerTrackingView({ ride }) {
  const [driverLocation, setDriverLocation] = useState(null);

  // Fetch driver profile
  const { data: driverProfile } = useQuery({
    queryKey: ['driverProfile', ride.driver_email],
    queryFn: async () => {
      const profiles = await base44.entities.DriverProfile.filter({ 
        user_email: ride.driver_email 
      });
      return profiles[0];
    },
    enabled: !!ride.driver_email,
  });

  // Poll for driver location updates every 5 seconds
  useQuery({
    queryKey: ['driverLocation', ride.id],
    queryFn: async () => {
      const updatedRide = await base44.entities.Ride.filter({ id: ride.id });
      if (updatedRide[0] && updatedRide[0].driver_current_lat) {
        const location = {
          lat: updatedRide[0].driver_current_lat,
          lng: updatedRide[0].driver_current_lng,
          heading: updatedRide[0].driver_heading || 0,
          speed: updatedRide[0].driver_speed || 0,
          timestamp: Date.now(),
        };
        setDriverLocation(location);
        return location;
      }
      return null;
    },
    refetchInterval: 5000, // Poll every 5 seconds
    enabled: ride.status === 'accepted' || ride.status === 'in_progress',
  });

  // Fallback: use driver profile location if no ride-specific location
  useEffect(() => {
    if (!driverLocation && driverProfile) {
      setDriverLocation({
        lat: driverProfile.current_lat || ride.pickup_lat,
        lng: driverProfile.current_lng || ride.pickup_lng,
        heading: 0,
        speed: 0,
        timestamp: Date.now(),
      });
    }
  }, [driverProfile, ride]);

  return (
    <div className="space-y-4">
      {/* Driver Info Card */}
      {driverProfile && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#15B46A] to-[#0F9456] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {ride.driver_email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-lg">{ride.driver_email}</p>
                  <p className="text-sm text-gray-600">
                    {driverProfile.vehicle_make} {driverProfile.vehicle_model}
                  </p>
                  <p className="text-xs text-gray-500">
                    {driverProfile.vehicle_color} • {driverProfile.vehicle_plate}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{driverProfile.rating || 5.0}</span>
                    <span className="text-xs text-gray-500">
                      ({driverProfile.total_trips || 0} trips)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => window.open(`tel:${driverProfile.phone}`)}
                >
                  <Phone className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-green-50 hover:bg-green-100"
                  onClick={() => window.open(`https://wa.me/${driverProfile.phone}`, '_blank')}
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location warning if driver location not available */}
      {!driverLocation && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Waiting for driver location... Make sure your driver has location services enabled.
          </AlertDescription>
        </Alert>
      )}

      {/* Live Tracking Map */}
      <LiveTrackingMap
        ride={ride}
        driverLocation={driverLocation}
        driverProfile={driverProfile}
      />
    </div>
  );
}