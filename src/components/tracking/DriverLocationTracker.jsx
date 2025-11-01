import React, { useEffect, useRef, useState } from "react";
import joltcab from "@/lib/joltcab-api";
import { useMutation } from "@tanstack/react-query";

/**
 * Component for drivers to track and update their location in real-time
 * This runs in the background while driver is online
 */
export default function DriverLocationTracker({ driverEmail, isOnline, activeRideId }) {
  const watchIdRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const [locationError, setLocationError] = useState(null);

  const updateLocationMutation = useMutation({
    mutationFn: async (locationData) => {
      // Update driver profile with current location
  const profiles = await joltcab.entities.DriverProfile.filter({ user_email: driverEmail });
      if (profiles[0]) {
  await joltcab.entities.DriverProfile.update(profiles[0].id, {
          current_lat: locationData.lat,
          current_lng: locationData.lng,
          last_location_update: new Date().toISOString(),
        });
      }

      // If there's an active ride, update ride location too
      if (activeRideId) {
  await joltcab.entities.Ride.update(activeRideId, {
          driver_current_lat: locationData.lat,
          driver_current_lng: locationData.lng,
        });
      }
    },
  });

  useEffect(() => {
    if (!isOnline || !navigator.geolocation) {
      return;
    }

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();
        
        // Only update every 10 seconds to avoid too many DB writes
        if (now - lastUpdateRef.current < 10000) {
          return;
        }

        lastUpdateRef.current = now;
        setLocationError(null);

        const locationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          heading: position.coords.heading || 0,
          speed: position.coords.speed || 0,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        updateLocationMutation.mutate(locationData);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    // Cleanup
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isOnline, driverEmail, activeRideId]);

  // This component doesn't render anything
  // It just tracks location in the background
  return null;
}