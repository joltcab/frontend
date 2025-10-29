import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook para consumir eventos en tiempo real
 * Uso:
 * const { data, isConnected, error } = useRealtimeTracking('ride_tracking', rideId);
 */

export default function useRealtimeTracking(channel, entityId = null) {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!channel) return;

    // Construir URL
    const baseUrl = '/api/functions/realtimeConnection';
    const params = new URLSearchParams({ channel });
    if (entityId) params.append('entity_id', entityId);
    
    const url = `${baseUrl}?${params.toString()}`;

    // Crear EventSource
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);

        // Si el viaje terminó, cerrar conexión
        if (parsedData.type === 'ride_ended') {
          eventSource.close();
          setIsConnected(false);
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err);
        setError(err.message);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      setError('Connection error');
      setIsConnected(false);
      eventSource.close();
    };

    // Cleanup
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        setIsConnected(false);
      }
    };
  }, [channel, entityId]);

  return { data, isConnected, error };
}