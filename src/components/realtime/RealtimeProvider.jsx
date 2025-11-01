import { createContext, useContext, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

const RealtimeContext = createContext(null);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within RealtimeProvider");
  }
  return context;
};

export function RealtimeProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [ws, setWs] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const DISABLE_REALTIME = import.meta.env.VITE_DISABLE_REALTIME === 'true';
  const WS_BASE_URL = import.meta.env.VITE_WS_URL; // e.g., ws://localhost:5001/api/realtime
  const MAX_RECONNECT_ATTEMPTS = Number(import.meta.env.VITE_WS_MAX_RECONNECT || 6);
  const IS_LOCALHOST = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  const connect = useCallback(async () => {
    try {
      const IS_DEV = import.meta.env.DEV === true;
      if (DISABLE_REALTIME || IS_LOCALHOST || IS_DEV) {
        console.warn("Realtime deshabilitado (entorno dev/local o VITE_DISABLE_REALTIME=true)");
        return;
      }

      // Evitar llamadas repetidas a /auth/me: sólo comprobamos si hay token
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Realtime omitido: no hay token de sesión');
        return;
      }

      // Create WebSocket connection
      let wsUrl = WS_BASE_URL || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/realtime`;
      if (WS_BASE_URL) {
        // Normalize: ensure path includes /api/realtime
        const hasPath = /\/[^/]/.test(new URL(WS_BASE_URL).pathname);
        if (!hasPath) {
          wsUrl = WS_BASE_URL.replace(/\/$/, '') + '/api/realtime';
        }
      }
      console.info('Connecting WebSocket to:', wsUrl);
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        console.log("✅ WebSocket connected");
        setConnected(true);
        setReconnectAttempts(0);
        
        // Send authentication
        websocket.send(JSON.stringify({
          type: 'auth',
          token
        }));
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'notification') {
            setNotifications(prev => [data.payload, ...prev].slice(0, 50));
            
            // Show browser notification if permitted
            if (Notification.permission === 'granted') {
              new Notification(data.payload.title, {
                body: data.payload.message,
                icon: '/icon-192.png'
              });
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      websocket.onclose = () => {
        console.log("❌ WebSocket disconnected");
        setConnected(false);

        // Stop after max attempts to avoid noisy loops
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.warn(`Realtime detenido tras ${reconnectAttempts} intentos. Configure VITE_WS_URL o VITE_DISABLE_REALTIME.`);
          return;
        }

        // Reconnect with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connect();
        }, delay);
      };

      websocket.onerror = (error) => {
        // Reduce noise: only log the first few errors
        if (reconnectAttempts < 3) {
          console.error("WebSocket error:", error);
        }
      };

      setWs(websocket);
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
    }
  }, [reconnectAttempts]);

  useEffect(() => {
    connect();
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
  };

  return (
    <RealtimeContext.Provider value={{
      connected,
      notifications,
      clearNotifications,
      markAsRead,
      ws
    }}>
      {children}
    </RealtimeContext.Provider>
  );
}

RealtimeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};