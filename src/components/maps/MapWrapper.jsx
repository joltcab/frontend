import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MapboxMap from "./MapboxMap";
import GoogleMapLoader from "./GoogleMapLoader";

/**
 * Smart Map Wrapper that uses Mapbox as primary and falls back to Google Maps
 */
export default function MapWrapper(props) {
  const { data: configs = [] } = useQuery({
    queryKey: ['systemConfigurations'],
    queryFn: () => base44.entities.SystemConfiguration.list(),
  });

  const useMapboxPrimary = configs.find(c => c.config_key === 'use_mapbox_primary')?.config_value === 'true';
  const mapboxToken = configs.find(c => c.config_key === 'mapbox_access_token')?.config_value;
  const googleMapsKey = configs.find(c => c.config_key === 'google_maps_api_key')?.config_value;

  // Use Mapbox if configured and set as primary
  if (useMapboxPrimary && mapboxToken) {
    return <MapboxMap {...props} />;
  }

  // Fallback to Google Maps
  if (googleMapsKey) {
    return <GoogleMapLoader {...props} />;
  }

  return (
    <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600">
      <p>No map service configured. Please set up Mapbox or Google Maps in System Configuration.</p>
    </div>
  );
}