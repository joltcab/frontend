import { useQuery } from "@tanstack/react-query";
import { joltcab } from "@/lib/joltcab-api";
import MapboxMap from "./MapboxMap";
import GoogleMapLoader from "./GoogleMapLoader";

/**
 * Smart Map Wrapper that uses Mapbox as primary and falls back to Google Maps
 */
export default function MapWrapper(props) {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => joltcab.settings.get(),
  });

  const { data: configStatus } = useQuery({
    queryKey: ['configStatus'],
    queryFn: () => joltcab.settings.getConfigStatus(),
  });

  const useMapboxPrimary = Boolean(settings?.use_mapbox_primary === true || settings?.use_mapbox_primary === 'true');
  const mapboxToken = settings?.mapbox_access_token;
  const googleConfigured = Boolean(configStatus?.status?.google_maps);

  // Usar Mapbox si está configurado y elegido como primario
  if (useMapboxPrimary && mapboxToken) {
    return <MapboxMap {...props} />;
  }

  // Fallback a Google Maps si está configurado en backend
  if (googleConfigured) {
    return <GoogleMapLoader {...props} />;
  }

  // Si solo Mapbox está configurado (sin toggle primario), aún podemos usarlo
  if (mapboxToken) {
    return <MapboxMap {...props} />;
  }

  return (
    <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600">
      <p>No map service configured. Please set up Mapbox or Google Maps in Integration Settings.</p>
    </div>
  );
}