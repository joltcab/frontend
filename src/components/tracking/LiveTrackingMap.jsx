
import React, { useState, useEffect, useRef } from "react";
import { useGoogleMaps } from "../maps/GoogleMapLoader";
import { Car, Navigation, Clock, User, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { VEHICLE_ICON_URL, rotateMarkerIcon } from "../maps/VehicleIcons";

export default function LiveTrackingMap({ ride, driverLocation, driverProfile, onRouteUpdate }) {
  const { isLoaded } = useGoogleMaps();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const dropoffMarkerRef = useRef(null);
  const routePolylineRef = useRef(null); // This is for the DRIVER'S current segment
  const directionsRendererRef = useRef(null); // Added for rendering the full trip path
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    if (!isLoaded || !window.google || !mapRef.current) return;

    // Initialize map with custom styling
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center: { lat: ride.pickup_lat, lng: ride.pickup_lng },
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    mapInstanceRef.current = map;

    // Initialize DirectionsRenderer for the full trip path (pickup to dropoff)
    // This will display the overall planned route.
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      map: map,
      polylineOptions: {
        strokeColor: "#A0A0A0", // Lighter, distinct color for the full planned route
        strokeOpacity: 0.6,
        strokeWeight: 4,
        icons: [{
            icon: {
                path: 'M 0,-1 0,1', // This creates a dashed line effect
                strokeOpacity: 1,
                scale: 3
            },
            offset: '0',
            repeat: '20px'
        }],
      },
      suppressMarkers: true // We are managing pickup/dropoff markers ourselves
    });

    // Add pickup marker with custom icon
    pickupMarkerRef.current = new window.google.maps.Marker({
      position: { lat: ride.pickup_lat, lng: ride.pickup_lng },
      map: map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#15B46A",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 3,
      },
      title: "Pickup Location",
      animation: window.google.maps.Animation.DROP,
    });

    // Add pickup info window
    const pickupInfoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px;">
          <strong style="color: #15B46A;">📍 Pickup</strong><br/>
          <span style="font-size: 12px;">${ride.pickup_location}</span>
        </div>
      `,
    });

    pickupMarkerRef.current.addListener("click", () => {
      pickupInfoWindow.open(map, pickupMarkerRef.current);
    });

    // Add dropoff marker
    dropoffMarkerRef.current = new window.google.maps.Marker({
      position: { lat: ride.dropoff_lat, lng: ride.dropoff_lng },
      map: map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#EF4444",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 3,
      },
      title: "Dropoff Location",
      animation: window.google.maps.Animation.DROP,
    });

    // Add dropoff info window
    const dropoffInfoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px;">
          <strong style="color: #EF4444;">🏁 Destination</strong><br/>
          <span style="font-size: 12px;">${ride.dropoff_location}</span>
        </div>
      `,
    });

    dropoffMarkerRef.current.addListener("click", () => {
      dropoffInfoWindow.open(map, dropoffMarkerRef.current);
    });

    return () => {
      if (pickupMarkerRef.current) pickupMarkerRef.current.setMap(null);
      if (dropoffMarkerRef.current) dropoffMarkerRef.current.setMap(null);
      if (driverMarkerRef.current) driverMarkerRef.current.setMap(null);
      if (routePolylineRef.current) routePolylineRef.current.setMap(null); // Cleans up driver's current segment
      if (directionsRendererRef.current) directionsRendererRef.current.setMap(null); // Cleans up full trip route
    };
  }, [isLoaded, ride]);

  // NEW useEffect for the full trip route calculation (pickup to dropoff)
  // This calculates the entire ride path and displays it using DirectionsRenderer.
  useEffect(() => {
    if (!isLoaded || !window.google || !mapRef.current || !ride) return;
    if (!directionsRendererRef.current) return; // Ensure renderer is initialized

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = directionsRendererRef.current;

    const request = {
      origin: new window.google.maps.LatLng(ride.pickup_lat, ride.pickup_lng),
      destination: new window.google.maps.LatLng(ride.dropoff_lat, ride.dropoff_lng),
      travelMode: window.google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: new Date(),
        trafficModel: window.google.maps.TrafficModel.BEST_GUESS
      },
      provideRouteAlternatives: false // We only need the primary route for the overall trip display
    };

    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
        
        // Send route data to parent for traffic alerts or other processing
        if (onRouteUpdate && result.routes[0]) {
          onRouteUpdate(result.routes[0]);
        }
      } else {
        console.error('Directions request for full trip failed due to ' + status);
      }
    });
  }, [ride, onRouteUpdate, isLoaded]); // isLoaded ensures window.google is ready

  // Existing useEffect for driver location updates and current segment routing
  useEffect(() => {
    if (!mapInstanceRef.current || !driverLocation || !window.google) return;

    const driverPos = { lat: driverLocation.lat, lng: driverLocation.lng };

    // Update or create driver marker
    if (driverMarkerRef.current) {
      // Smooth animation to new position
      const currentPos = driverMarkerRef.current.getPosition();
      if (currentPos) {
        animateMarker(driverMarkerRef.current, currentPos, driverPos);
      }
      
      // Update rotation if heading changed
      if (driverLocation.heading !== undefined && driverLocation.heading !== null) {
        const rotatedIcon = rotateMarkerIcon(VEHICLE_ICON_URL, driverLocation.heading);
        driverMarkerRef.current.setIcon({
            url: rotatedIcon,
            scaledSize: new window.google.maps.Size(50, 50),
            anchor: new window.google.maps.Point(25, 25),
        });
      }
    } else {
      driverMarkerRef.current = new window.google.maps.Marker({
        position: driverPos,
        map: mapInstanceRef.current,
        icon: {
            url: VEHICLE_ICON_URL,
            scaledSize: new window.google.maps.Size(50, 50),
            anchor: new window.google.maps.Point(25, 25),
        },
        title: `Driver: ${ride.driver_email}`,
        zIndex: 1000,
        optimized: false, // Important for icon updates/canvas icons
      });

      // Add driver info window
      const driverInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <strong style="color: #15B46A;">🚗 Your Driver</strong><br/>
            <span style="font-size: 13px;">${ride.driver_email}</span><br/>
            <span style="font-size: 12px; color: #666;">
              ${driverProfile?.vehicle_make || ''} ${driverProfile?.vehicle_model || ''}<br/>
              ${driverProfile?.vehicle_color || ''} • ${driverProfile?.vehicle_plate || ''}
            </span>
          </div>
        `,
      });

      driverMarkerRef.current.addListener("click", () => {
        driverInfoWindow.open(mapInstanceRef.current, driverMarkerRef.current);
      });
    }

    // Calculate route to appropriate destination (driver's immediate segment)
    const destination = ride.status === 'accepted' || ride.status === 'negotiating'
      ? { lat: ride.pickup_lat, lng: ride.pickup_lng }
      : { lat: ride.dropoff_lat, lng: ride.dropoff_lng };

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: driverPos,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: 'bestguess'
        }
      },
      (result, status) => {
        if (status === "OK" && result.routes[0]) {
          // Update route polyline for driver's current segment
          if (routePolylineRef.current) {
            routePolylineRef.current.setMap(null); // Clear previous polyline
          }

          routePolylineRef.current = new window.google.maps.Polyline({
            path: result.routes[0].overview_path,
            geodesic: true,
            strokeColor: "#15B46A", // Distinct solid color for driver's active segment
            strokeOpacity: 0.8,
            strokeWeight: 5,
            map: mapInstanceRef.current,
          });

          // Update ETA and distance for driver's current segment
          const leg = result.routes[0].legs[0];
          setEta(leg.duration.text);
          setDistance(leg.distance.text);
          setDuration(leg.duration.value); // in seconds

          // Adjust map bounds to show driver and immediate destination
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(driverPos);
          bounds.extend(destination);
          mapInstanceRef.current.fitBounds(bounds, {
            padding: { top: 100, right: 50, bottom: 150, left: 50 }
          });
        } else {
            console.error('Driver segment directions request failed due to ' + status);
        }
      }
    );
  }, [driverLocation, ride, driverProfile, isLoaded]); // isLoaded ensures window.google is ready

  // Smooth marker animation
  const animateMarker = (marker, from, to) => {
    const steps = 60;
    let step = 0;

    const animate = () => {
      if (step >= steps) return;

      const lat = from.lat() + (to.lat - from.lat()) * (step / steps);
      const lng = from.lng() + (to.lng - from.lng()) * (step / steps);

      marker.setPosition(new window.google.maps.LatLng(lat, lng));
      step++;

      requestAnimationFrame(animate);
    };

    animate();
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[500px] rounded-xl shadow-lg" />

      {/* Floating Info Cards */}
      <AnimatePresence>
        {driverLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-4 left-4 right-4 pointer-events-none"
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl pointer-events-auto">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#15B46A] to-[#0F9456] rounded-full flex items-center justify-center shadow-lg">
                      <Car className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">
                        {ride.status === 'accepted' ? 'Driver is on the way' : 'Heading to destination'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {driverProfile?.vehicle_make} {driverProfile?.vehicle_model}
                      </p>
                      <p className="text-xs text-gray-500">
                        {driverProfile?.vehicle_color} • {driverProfile?.vehicle_plate}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {eta && (
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-[#15B46A] text-2xl">{eta}</span>
                      </div>
                    )}
                    {distance && (
                      <p className="text-xs text-gray-600">{distance} away</p>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {duration !== null && ride.duration_minutes !== undefined && ride.duration_minutes !== null && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{eta ? `${eta} remaining` : `${Math.round(duration / 60)} min remaining`}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        // Calculate progress based on remaining duration of driver's current segment
                        // relative to the total estimated ride duration.
                        // `ride.duration_minutes` is expected total ride duration (pickup to dropoff).
                        // `duration` is the remaining time for the driver's current segment.
                        animate={{ width: `${Math.min(100, (1 - (duration / (ride.duration_minutes * 60 || 1))) * 100)}%` }}
                        className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] h-2 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Driver Speed */}
                {driverLocation.speed !== undefined && driverLocation.speed !== null && (
                  <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                    <span className="text-gray-600">Current Speed:</span>
                    <Badge variant="outline" className="font-semibold">
                      {Math.round(driverLocation.speed)} km/h
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-3">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#15B46A]"></div>
            <span className="font-medium">Pickup</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="font-medium">Dropoff</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={VEHICLE_ICON_URL} alt="car" className="w-4 h-4" />
            <span className="font-medium">Your Driver</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Visual representation of dashed line for total trip, matching DirectionsRenderer style */}
            <div style={{
                width: '12px',
                height: '0px',
                borderTop: '2px dashed #A0A0A0',
                marginRight: '8px'
            }}></div>
            <span className="font-medium">Total Trip</span>
          </div>
        </div>
      </div>

      {/* Recenter Button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current) {
            const bounds = new window.google.maps.LatLngBounds();
            if (driverLocation) {
                // If driver location is available, center on driver and immediate destination
                bounds.extend({ lat: driverLocation.lat, lng: driverLocation.lng });
                const destination = ride.status === 'accepted' || ride.status === 'negotiating'
                ? { lat: ride.pickup_lat, lng: ride.pickup_lng }
                : { lat: ride.dropoff_lat, lng: ride.dropoff_lng };
                bounds.extend(destination);
            } else {
                // Otherwise, center on the full trip (pickup to dropoff)
                bounds.extend({ lat: ride.pickup_lat, lng: ride.pickup_lng });
                bounds.extend({ lat: ride.dropoff_lat, lng: ride.dropoff_lng });
            }
            mapInstanceRef.current.fitBounds(bounds, { padding: 100 });
          }
        }}
        className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
      >
        <Navigation className="w-5 h-5 text-[#15B46A]" />
      </button>
    </div>
  );
}
