import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { joltcab } from "@/lib/joltcab-api";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PropTypes from "prop-types";

export default function MapboxMap({ 
  center = [-84.3880, 33.7490], // Atlanta default
  zoom = 12,
  markers = [],
  onMapClick,
  style = { width: '100%', height: '400px' }
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);
  const markersRef = useRef([]);

  // Obtener token y preferencia desde joltcab settings
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => joltcab.settings.get(),
  });

  const mapboxToken = settings?.mapbox_access_token;
  const useMapboxPrimary = Boolean(settings?.use_mapbox_primary === true || settings?.use_mapbox_primary === 'true');

  useEffect(() => {
    if (!mapboxToken || !useMapboxPrimary) return;
    if (map.current) return; // Initialize map only once

    // Load Mapbox GL JS
    const loadMapbox = async () => {
      try {
        // Load Mapbox CSS
        if (!document.querySelector('link[href*="mapbox-gl.css"]')) {
          const link = document.createElement('link');
          link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }

        // Load Mapbox JS
        if (!window.mapboxgl) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        window.mapboxgl.accessToken = mapboxToken;

        map.current = new window.mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: center,
          zoom: zoom
        });

        map.current.on('load', () => {
          setMapLoaded(true);
          
          // Add navigation controls
          map.current.addControl(new window.mapboxgl.NavigationControl());
          
          // Add click handler
          if (onMapClick) {
            map.current.on('click', (e) => {
              onMapClick({
                lat: e.lngLat.lat,
                lng: e.lngLat.lng
              });
            });
          }
        });

      } catch (err) {
        console.error('Error loading Mapbox:', err);
        setError('Failed to load map. Please check your Mapbox configuration.');
      }
    };

    loadMapbox();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, useMapboxPrimary, center, zoom, onMapClick]);

  // Update markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach(markerData => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundImage = markerData.icon || 'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundSize = '100%';
      el.style.cursor = 'pointer';

      const marker = new window.mapboxgl.Marker(el)
        .setLngLat([markerData.lng, markerData.lat])
        .addTo(map.current);

      if (markerData.popup) {
        const popup = new window.mapboxgl.Popup({ offset: 25 })
          .setHTML(markerData.popup);
        marker.setPopup(popup);
      }

      markersRef.current.push(marker);
    });
  }, [markers, mapLoaded]);

  // Update center
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.flyTo({ center: center, zoom: zoom });
    }
  }, [center, zoom, mapLoaded]);

  if (!mapboxToken) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Mapbox token not configured. Please set it in System Configuration.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="relative" style={style}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
        </div>
      )}
    </div>
  );
}

MapboxMap.propTypes = {
  center: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    })
  ]),
  zoom: PropTypes.number,
  markers: PropTypes.arrayOf(PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
    icon: PropTypes.string,
    popup: PropTypes.string,
    title: PropTypes.string,
  })),
  onMapClick: PropTypes.func,
  style: PropTypes.object,
};