import React, { useEffect, useRef, useState } from "react";
import joltcab from "@/lib/joltcab-api";
import { Loader2 } from "lucide-react";

export default function RouteMap({ pickup, dropoff, height = "400px" }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const routePolylineRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    // Initialize map
    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: pickup,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    setMap(newMap);
  }, []);

  useEffect(() => {
    if (!map || !pickup || !dropoff) return;

    fetchAndDrawRoute();
  }, [map, pickup, dropoff]);

  const fetchAndDrawRoute = async () => {
    setLoading(true);
    
    try {
      // Clear existing route and markers
      if (routePolylineRef.current) {
        routePolylineRef.current.setMap(null);
      }
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Fetch route from backend
      const { data } = await joltcab.functions.invoke('calculateRoute', {
        origin: pickup,
        destination: dropoff,
        departure_time: 'now',
        alternatives: false
      });

      if (data.success && data.route) {
        setRoute(data.route);

        // Draw route polyline
        if (data.route.polyline && window.google) {
          const decodedPath = window.google.maps.geometry.encoding.decodePath(data.route.polyline);
          
          const routePolyline = new window.google.maps.Polyline({
            path: decodedPath,
            geodesic: true,
            strokeColor: '#15B46A',
            strokeOpacity: 0.8,
            strokeWeight: 5,
            map: map
          });

          routePolylineRef.current = routePolyline;

          // Fit bounds to show entire route
          const bounds = new window.google.maps.LatLngBounds();
          decodedPath.forEach(point => bounds.extend(point));
          map.fitBounds(bounds);
        } else {
          // Fallback: draw straight line if no polyline
          const straightLine = new window.google.maps.Polyline({
            path: [pickup, dropoff],
            geodesic: true,
            strokeColor: '#15B46A',
            strokeOpacity: 0.6,
            strokeWeight: 3,
            strokeStyle: 'dashed',
            map: map
          });

          routePolylineRef.current = straightLine;

          // Fit bounds
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(pickup);
          bounds.extend(dropoff);
          map.fitBounds(bounds);
        }

        // Add pickup marker
        const pickupMarker = new window.google.maps.Marker({
          position: pickup,
          map: map,
          title: 'Pickup',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#15B46A',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          },
          label: {
            text: 'A',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 'bold'
          }
        });

        // Add dropoff marker
        const dropoffMarker = new window.google.maps.Marker({
          position: dropoff,
          map: map,
          title: 'Dropoff',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#EF4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          },
          label: {
            text: 'B',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 'bold'
          }
        });

        markersRef.current = [pickupMarker, dropoffMarker];
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {route && !loading && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{route.distance_text}</p>
              <p className="text-gray-600">{route.duration_text}</p>
            </div>
            {route.warnings && route.warnings.length > 0 && (
              <div className="text-xs text-yellow-600">
                ⚠️ {route.warnings[0]}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}