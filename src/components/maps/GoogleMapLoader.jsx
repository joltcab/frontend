import React, { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { joltcab } from "@/lib/joltcab-api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

let isGoogleMapsLoading = false;
let googleMapsLoaded = false;

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(googleMapsLoaded);
  const [loadError, setLoadError] = useState(null);

  const { data: configStatus } = useQuery({
    queryKey: ['configStatus'],
    queryFn: () => joltcab.settings.getConfigStatus(),
  });

  useEffect(() => {
    // Check if Google Maps is configured
    const isGoogleMapsConfigured = configStatus?.status?.google_maps;
    
    if (!isGoogleMapsConfigured) {
      setLoadError(new Error('Google Maps API not configured'));
      return;
    }

    // If already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      googleMapsLoaded = true;
      setIsLoaded(true);
      return;
    }

    // If currently loading, wait
    if (isGoogleMapsLoading) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          googleMapsLoaded = true;
          setIsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      
      setTimeout(() => clearInterval(checkInterval), 10000);
      return;
    }

    // Start loading
    isGoogleMapsLoading = true;

    // Get Google Maps API key from settings
    const loadGoogleMapsKey = async () => {
      try {
        const settings = await joltcab.settings.get();
        const API_KEY = settings?.web_app_google_key;
        
        if (!API_KEY) {
          setLoadError(new Error('Google Maps API key not found'));
          isGoogleMapsLoading = false;
          return;
        }
        
        loadGoogleMapsScript(API_KEY);
      } catch (error) {
        setLoadError(error);
        isGoogleMapsLoading = false;
      }
    };
    
    loadGoogleMapsKey();
  }, [configStatus]);

  const loadGoogleMapsScript = (API_KEY) => {

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          googleMapsLoaded = true;
          isGoogleMapsLoading = false;
          setIsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(checkInterval);
        isGoogleMapsLoading = false;
      }, 10000);
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,geometry,drawing&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    // Global callback
    window.initGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        googleMapsLoaded = true;
        isGoogleMapsLoading = false;
        setIsLoaded(true);
      } else {
        isGoogleMapsLoading = false;
        setLoadError(new Error('Google Maps loaded but places library not available'));
      }
    };

    script.onerror = () => {
      isGoogleMapsLoading = false;
      setLoadError(new Error('Failed to load Google Maps'));
    };

    document.head.appendChild(script);

    return () => {
      delete window.initGoogleMaps;
    };
  };

  return { isLoaded, loadError };
}

export default function GoogleMapLoader({ children }) {
  const { isLoaded, loadError } = useGoogleMaps();

  if (loadError) {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-5 w-5 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold mb-2">Google Maps Not Configured</p>
              <p className="text-sm">
                This feature requires Google Maps API to be configured. Please set up your Google Maps API key in the Setup Wizard.
              </p>
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
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading Google Maps...</span>
      </div>
    );
  }

  return <>{children}</>;
}