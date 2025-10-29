import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Save, Trash2 } from 'lucide-react';
import { useGoogleMaps } from './GoogleMapLoader';

export default function ZoneDrawer({ 
  center = { lat: 33.7490, lng: -84.3880 },
  existingZones = [],
  onZoneSaved,
  onCancel,
  height = "600px"
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const currentPolygonRef = useRef(null);
  const existingPolygonsRef = useRef([]);
  const { isLoaded } = useGoogleMaps();
  
  const [drawingMode, setDrawingMode] = useState(false);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    console.log('🗺️ Initializing map...', { center, existingZones: existingZones.length });

    // Initialize map
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    console.log('✅ Map initialized');

    // Initialize drawing manager
    drawingManagerRef.current = new window.google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      polygonOptions: {
        fillColor: '#15B46A',
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: '#15B46A',
        clickable: true,
        editable: true,
        zIndex: 1
      }
    });

    drawingManagerRef.current.setMap(mapInstanceRef.current);
    console.log('✅ Drawing manager initialized');

    // Listen for polygon complete
    window.google.maps.event.addListener(
      drawingManagerRef.current,
      'polygoncomplete',
      (polygon) => {
        console.log('✅ Polygon drawn');
        const coordinates = polygon.getPath().getArray().map(latLng => ({
          lat: latLng.lat(),
          lng: latLng.lng()
        }));
        
        currentPolygonRef.current = polygon;
        setDrawingMode(false);
        drawingManagerRef.current.setDrawingMode(null);

        // Immediately save
        handleSave(coordinates);
      }
    );

    // Load existing zones
    existingZones.forEach(zone => {
      if (!zone.coordinates || zone.coordinates.length < 3) return;

      const polygon = new window.google.maps.Polygon({
        paths: zone.coordinates,
        fillColor: zone.color || '#15B46A',
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: zone.color || '#15B46A',
        clickable: true,
        editable: false,
      });

      polygon.setMap(mapInstanceRef.current);
      existingPolygonsRef.current.push(polygon);

      // Add info window
      polygon.addListener('click', () => {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="padding: 8px;">
            <strong>${zone.name}</strong><br/>
            ${zone.is_airport ? '<span style="color: blue;">✈️ Airport Zone</span>' : ''}
          </div>`,
          position: zone.coordinates[0]
        });
        infoWindow.open(mapInstanceRef.current);
      });
    });

    console.log('✅ Loaded', existingPolygonsRef.current.length, 'existing zones');

    return () => {
      existingPolygonsRef.current.forEach(p => p.setMap(null));
      if (currentPolygonRef.current) currentPolygonRef.current.setMap(null);
    };
  }, [isLoaded, center, existingZones]);

  const startDrawing = () => {
    console.log('🖊️ Starting drawing mode');
    setDrawingMode(true);
    if (drawingManagerRef.current && window.google) {
      drawingManagerRef.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
    }
  };

  const handleSave = (coordinates) => {
    if (!coordinates || coordinates.length < 3) {
      alert('Please draw a valid zone with at least 3 points');
      return;
    }

    console.log('💾 Saving zone with', coordinates.length, 'points');
    
    if (onZoneSaved) {
      onZoneSaved({
        coordinates,
        color: '#15B46A'
      });
    }

    // Clear current polygon
    if (currentPolygonRef.current) {
      currentPolygonRef.current.setMap(null);
      currentPolygonRef.current = null;
    }
  };

  const cancelDrawing = () => {
    if (currentPolygonRef.current) {
      currentPolygonRef.current.setMap(null);
      currentPolygonRef.current = null;
    }
    setDrawingMode(false);
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
    if (onCancel) {
      onCancel();
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
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Draw Zone Boundaries</h3>
            <p className="text-sm text-gray-600">Click on the map to draw zone boundaries</p>
          </div>
          
          <div className="flex gap-2">
            {!drawingMode && (
              <Button onClick={startDrawing} className="bg-[#15B46A] hover:bg-[#0F9456]">
                <Pencil className="w-4 h-4 mr-2" />
                Start Drawing
              </Button>
            )}
            <Button onClick={cancelDrawing} variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </Card>

      <div ref={mapRef} style={{ height, width: '100%' }} className="rounded-xl shadow-lg border-2 border-gray-200" />

      {drawingMode && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800 font-medium">
            🖊️ Drawing Mode Active - Click on the map to draw your zone. Click the first point again to complete the polygon.
          </p>
        </Card>
      )}
    </div>
  );
}