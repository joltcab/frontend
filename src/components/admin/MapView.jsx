import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, User, Navigation } from "lucide-react";
import GoogleMapLoader from "../maps/GoogleMapLoader";
import InteractiveMap from "../maps/InteractiveMap";
import { VEHICLE_ICON_URL } from "../maps/VehicleIcons";

export default function MapView() {
  const { data: drivers = [] } = useQuery({
    queryKey: ['onlineDrivers'],
    queryFn: () => base44.entities.DriverProfile.filter({ is_online: true }),
    refetchInterval: 10000,
  });

  const { data: activeTrips = [] } = useQuery({
    queryKey: ['activeTrips'],
    queryFn: () => base44.entities.Ride.filter({ 
      status: ['in_progress', 'accepted', 'requested'] 
    }),
    refetchInterval: 5000,
  });

  // Convert drivers to map markers usando la imagen real del auto verde
  const driverMarkers = drivers.map(driver => ({
    lat: driver.current_lat || 33.7490,
    lng: driver.current_lng || -84.3880,
    title: driver.user_email,
    icon: {
      url: VEHICLE_ICON_URL,
      scaledSize: { width: 40, height: 40 }
    },
    info: `
      <div style="padding: 8px;">
        <strong>${driver.user_email}</strong><br/>
        ${driver.vehicle_make} ${driver.vehicle_model}<br/>
        <span style="color: green;">● Online</span>
      </div>
    `
  }));

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online Drivers</p>
                <p className="text-3xl font-bold text-green-600">{drivers.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Trips</p>
                <p className="text-3xl font-bold text-blue-600">{activeTrips.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Navigation className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Coverage Cities</p>
                <p className="text-3xl font-bold text-purple-600">5</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Google Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Real-Time Map View - {drivers.length} Online Drivers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GoogleMapLoader>
            <InteractiveMap
              center={{ lat: 33.7490, lng: -84.3880 }}
              markers={driverMarkers}
              height="600px"
              showUserLocation={false}
            />
          </GoogleMapLoader>
        </CardContent>
      </Card>

      {/* Online Drivers List */}
      <Card>
        <CardHeader>
          <CardTitle>Online Drivers ({drivers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {drivers.slice(0, 10).map((driver) => (
              <div
                key={driver.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {driver.user_email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{driver.user_email}</p>
                    <p className="text-sm text-gray-600">
                      {driver.vehicle_make} {driver.vehicle_model}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
            
            {drivers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No drivers online</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}