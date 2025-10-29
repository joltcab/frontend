
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Phone, MessageCircle, Navigation, Clock, 
  User, Car, MapPin, Loader2, Share2 
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import GoogleMapLoader from "../components/maps/GoogleMapLoader";
import LiveTrackingMap from "../components/tracking/LiveTrackingMap";
import EmergencyButton from "../components/safety/EmergencyButton";
import ShareTripDialog from "../components/safety/ShareTripDialog";
import WazeIntegration from "../components/navigation/WazeIntegration";
import TrafficAlerts from "../components/navigation/TrafficAlerts";

export default function TrackRide() {
  const [user, setUser] = useState(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);
  const rideId = urlParams.get('ride_id');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user");
    }
  };

  const { data: ride } = useQuery({
    queryKey: ['trackRide', rideId],
    queryFn: async () => {
      const rides = await base44.entities.Ride.filter({ id: rideId });
      return rides[0];
    },
    enabled: !!rideId,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const { data: driverProfile } = useQuery({
    queryKey: ['trackDriverProfile', ride?.driver_email],
    queryFn: async () => {
      const profiles = await base44.entities.DriverProfile.filter({ 
        user_email: ride.driver_email 
      });
      return profiles[0];
    },
    enabled: !!ride?.driver_email,
    refetchInterval: 3000, // Refetch every 3 seconds for live location
  });

  if (!user || !ride) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-[#15B46A] animate-spin" />
      </div>
    );
  }

  const driverLocation = driverProfile ? {
    lat: driverProfile.current_lat,
    lng: driverProfile.current_lng,
    heading: driverProfile.driver_heading || 0,
  } : null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="font-bold text-gray-900">Track Your Ride</h1>
            <p className="text-sm text-gray-600">
              {ride?.status === 'accepted' ? 'Driver on the way' : 
               ride?.status === 'in_progress' ? 'Trip in progress' : 
               ride?.status}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Traffic Alerts */}
      {routeData && <TrafficAlerts route={routeData} />}

      {/* Map */}
      <div className="relative">
        <GoogleMapLoader>
          <LiveTrackingMap
            ride={ride}
            driverLocation={driverLocation}
            driverProfile={driverProfile}
            onRouteUpdate={setRouteData}
          />
        </GoogleMapLoader>
      </div>

      {/* Emergency Button - Always visible during active trip */}
      {ride && user && (ride.status === 'accepted' || ride.status === 'in_progress') && (
        <EmergencyButton ride={ride} user={user} />
      )}

      {/* Share Trip Dialog */}
      {ride && (
        <ShareTripDialog
          ride={ride}
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
        />
      )}

      {/* Bottom Info Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 max-h-[50vh] overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <Badge className={
              ride.status === 'accepted' ? 'bg-green-100 text-green-800 text-lg px-6 py-2' :
              ride.status === 'in_progress' ? 'bg-blue-100 text-blue-800 text-lg px-6 py-2' :
              'bg-gray-100 text-gray-800 text-lg px-6 py-2'
            }>
              {ride.status === 'accepted' ? '🚗 Driver on the way' :
               ride.status === 'in_progress' ? '🛣️ Trip in progress' :
               ride.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Driver Info */}
          {driverProfile && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#15B46A] to-[#0F9456] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {ride.driver_email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{ride.driver_email}</p>
                      <p className="text-sm text-gray-600">
                        {driverProfile.vehicle_make} {driverProfile.vehicle_model}
                      </p>
                      <p className="text-sm text-gray-600">
                        {driverProfile.vehicle_color} • {driverProfile.vehicle_plate}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm font-semibold">{driverProfile.rating || 5.0}</span>
                        <span className="text-xs text-gray-500">
                          ({driverProfile.total_trips || 0} trips)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="icon" className="bg-green-600 hover:bg-green-700">
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trip Details */}
          <div className="space-y-3">
            {/* Pickup */}
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 bg-green-500 rounded-full mt-1"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Pickup</p>
                <p className="font-semibold text-gray-900">{ride.pickup_location}</p>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-6"></div>

            {/* Dropoff */}
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full mt-1"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Dropoff</p>
                <p className="font-semibold text-gray-900">{ride.dropoff_location}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">
                {ride.distance_km?.toFixed(1) || '--'}
              </p>
              <p className="text-sm text-gray-600">km</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">
                {ride.duration_minutes || '--'}
              </p>
              <p className="text-sm text-gray-600">min</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-[#15B46A]">
                ${ride.agreed_price?.toFixed(2) || '--'}
              </p>
              <p className="text-sm text-gray-600">fare</p>
            </div>
          </div>

          {/* Waze Integration */}
          {ride && (
            <WazeIntegration
              pickup={{ lat: ride.pickup_lat, lng: ride.pickup_lng }}
              dropoff={{ lat: ride.dropoff_lat, lng: ride.dropoff_lng }}
            />
          )}

          {/* Share Location Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Track my JoltCab ride',
                  text: 'Follow my ride in real-time',
                  url: window.location.href,
                });
              }
            }}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Share Live Location
          </Button>
        </div>
      </div>
    </div>
  );
}
