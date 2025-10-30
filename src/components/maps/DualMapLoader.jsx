import React, { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { joltcab } from "@/lib/joltcab-api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Settings, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

let isMapboxLoading = false;
let mapboxLoaded = false;
let isGoogleMapsLoading = false;
let googleMapsLoaded = false;

export function useDualMaps() {
  const [mapProvider, setMapProvider] = useState(null); // 'mapbox' or 'google'
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [useMapboxPrimary, setUseMapboxPrimary] = useState(true);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => joltcab.settings.get(),
  });

  const { data: configStatus } = useQuery({
    queryKey: ['configStatus'],
    queryFn: () => joltcab.settings.getConfigStatus(),
  });

  useEffect(() => {
    if (!settings || !configStatus) return;

    const mapboxConfigured = !!settings.mapbox_access_token;
    const googleMapsConfigured = configStatus?.status?.google_maps;

    // Verificar si al menos uno está configurado
    if (!mapboxConfigured && !googleMapsConfigured) {
      setLoadError(new Error('No map provider configured'));
      return;
    }

    // Intentar cargar Mapbox primero si está configurado y es primario
    if (mapboxConfigured && (settings.use_mapbox_primary == 'true' || settings.use_mapbox_primary === true) || !googleMapsConfigured) {
      loadMapbox(settings.mapbox_access_token);
    } 
    // Si Mapbox no está configurado o no es primario, usar Google Maps
    else if (googleMapsConfigured) {
      loadGoogleMaps(settings.web_app_google_key);
    }
    // Si solo Mapbox está configurado
    else if (mapboxConfigured) {
      loadMapbox(settings.mapbox_access_token);
    }
  }, [settings, configStatus, useMapboxPrimary]);

  const loadMapbox = async (accessToken) => {
    if (mapboxLoaded) {
      setMapProvider('mapbox');
      setIsLoaded(true);
      return;
    }

    if (isMapboxLoading) return;
    isMapboxLoading = true;

    try {
      // Cargar CSS de Mapbox
      if (!document.querySelector('link[href*="mapbox-gl.css"]')) {
        const link = document.createElement('link');
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }

      // Cargar script de Mapbox
      if (!document.querySelector('script[src*="mapbox-gl.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
        script.async = true;

        script.onload = () => {
          if (window.mapboxgl) {
            window.mapboxgl.accessToken = accessToken;
            mapboxLoaded = true;
            isMapboxLoading = false;
            setMapProvider('mapbox');
            setIsLoaded(true);
            console.log('✅ Mapbox loaded successfully');
          }
        };

        script.onerror = () => {
          console.warn('⚠️ Mapbox failed to load, falling back to Google Maps');
          isMapboxLoading = false;
          // Fallback a Google Maps
          if (settings?.web_app_google_key) {
            loadGoogleMaps(settings.web_app_google_key);
          } else {
            setLoadError(new Error('Mapbox failed and Google Maps not configured'));
          }
        };

        document.head.appendChild(script);
      }
    } catch (error) {
      console.error('Mapbox error:', error);
      isMapboxLoading = false;
      // Fallback a Google Maps
      if (settings?.web_app_google_key) {
        loadGoogleMaps(settings.web_app_google_key);
      }
    }
  };

  const loadGoogleMaps = (apiKey) => {
    if (googleMapsLoaded || window.google?.maps) {
      setMapProvider('google');
      setIsLoaded(true);
      return;
    }

    if (isGoogleMapsLoading) return;
    isGoogleMapsLoading = true;

    // Verificar si el script ya existe
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          googleMapsLoaded = true;
          isGoogleMapsLoading = false;
          setMapProvider('google');
          setIsLoaded(true);
          clearInterval(checkInterval);
          console.log('✅ Google Maps loaded successfully');
        }
      }, 100);
      setTimeout(() => clearInterval(checkInterval), 10000);
      return;
    }

    // Crear callback global
    window.initGoogleMaps = () => {
      if (window.google?.maps?.places) {
        googleMapsLoaded = true;
        isGoogleMapsLoading = false;
        setMapProvider('google');
        setIsLoaded(true);
        console.log('✅ Google Maps loaded successfully');
      }
    };

    // Cargar script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,drawing&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error('❌ Google Maps failed to load');
      isGoogleMapsLoading = false;
      setLoadError(new Error('Both Mapbox and Google Maps failed to load'));
    };

    document.head.appendChild(script);
  };

  const switchProvider = () => {
    setUseMapboxPrimary(!useMapboxPrimary);
    setIsLoaded(false);
    setMapProvider(null);
  };

  return { 
    isLoaded, 
    loadError, 
    mapProvider,
    useMapboxPrimary,
    switchProvider,
    hasMapbox: !!settings?.mapbox_access_token,
    hasGoogleMaps: configStatus?.status?.google_maps,
  };
}

export default function DualMapLoader({ children }) {
  const { 
    isLoaded, 
    loadError, 
    mapProvider,
    useMapboxPrimary,
    switchProvider,
    hasMapbox,
    hasGoogleMaps,
  } = useDualMaps();

  if (loadError) {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-5 w-5 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold mb-2">Map Services Not Configured</p>
              <p className="text-sm mb-3">
                This feature requires at least one map provider (Mapbox or Google Maps) to be configured.
              </p>
              <div className="space-y-1 text-xs">
                <p>• <strong>Mapbox:</strong> {hasMapbox ? '✅ Configured' : '❌ Not configured'}</p>
                <p>• <strong>Google Maps:</strong> {hasGoogleMaps ? '✅ Configured' : '❌ Not configured'}</p>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={() => window.location.href = '/AdminPanel?tab=diagnostic'}
              className="ml-4"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-gray-600">
          Loading {useMapboxPrimary ? 'Mapbox' : 'Google Maps'}...
        </span>
        {hasMapbox && hasGoogleMaps && (
          <p className="text-xs text-gray-500 mt-2">
            {useMapboxPrimary ? 'Will fallback to Google Maps if needed' : 'Mapbox available as backup'}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Badge indicando qué proveedor se está usando */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Badge variant="outline" className="bg-white/90 backdrop-blur">
          <MapPin className="w-3 h-3 mr-1" />
          {mapProvider === 'mapbox' ? 'Mapbox' : 'Google Maps'}
        </Badge>
        {hasMapbox && hasGoogleMaps && (
          <Button
            size="sm"
            variant="outline"
            onClick={switchProvider}
            className="bg-white/90 backdrop-blur text-xs h-6"
          >
            Switch to {useMapboxPrimary ? 'Google' : 'Mapbox'}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

// Hook para obtener el proveedor actual
export function useCurrentMapProvider() {
  const { mapProvider } = useDualMaps();
  return mapProvider;
}
