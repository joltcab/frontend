import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation, Minus, Plus } from 'lucide-react';
import { useGoogleMaps } from './GoogleMapLoader';

export default function InteractiveMap({ 
  center = { lat: 33.7490, lng: -84.3880 }, // Atlanta default
  zoom = 12,
  markers = [],
  onMarkerClick,
  height = "500px",
  showUserLocation = true,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const { isLoaded } = useGoogleMaps();
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location
  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [showUserLocation]);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ],
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
      if (userMarkerRef.current) userMarkerRef.current.setMap(null);
    };
  }, [isLoaded, center, zoom]);

  // Add user location marker
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    userMarkerRef.current = new window.google.maps.Marker({
      position: userLocation,
      map: mapInstanceRef.current,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      title: 'Your Location',
    });
  }, [userLocation]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: mapInstanceRef.current,
        title: markerData.title,
        icon: markerData.icon || {
          url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
        },
      });

      if (onMarkerClick) {
        marker.addListener('click', () => onMarkerClick(markerData));
      }

      // Add info window if content provided
      if (markerData.info) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: markerData.info,
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });
      }

      markersRef.current.push(marker);
    });

    // Fit bounds if multiple markers
    if (markers.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach(marker => bounds.extend({ lat: marker.lat, lng: marker.lng }));
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [markers, isLoaded, onMarkerClick]);

  const handleRecenter = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(userLocation);
      mapInstanceRef.current.setZoom(15);
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
    }
  };

  if (!isLoaded) {
    return (
      <Card style={{ height }} className="flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} style={{ height, width: '100%' }} className="rounded-xl shadow-lg" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {showUserLocation && userLocation && (
          <Button
            size="icon"
            className="bg-white text-gray-700 hover:bg-gray-50 shadow-lg"
            onClick={handleRecenter}
          >
            <Navigation className="w-4 h-4" />
          </Button>
        )}
        <Button
          size="icon"
          className="bg-white text-gray-700 hover:bg-gray-50 shadow-lg"
          onClick={handleZoomIn}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          className="bg-white text-gray-700 hover:bg-gray-50 shadow-lg"
          onClick={handleZoomOut}
        >
          <Minus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}