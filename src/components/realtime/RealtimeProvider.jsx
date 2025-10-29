import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";

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

  const connect = useCallback(async () => {
    try {
      const user = await base44.auth.me();
      if (!user) return;

      // Create WebSocket connection
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/realtime`;
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        console.log("✅ WebSocket connected");
        setConnected(true);
        setReconnectAttempts(0);
        
        // Send authentication
        websocket.send(JSON.stringify({
          type: 'auth',
          token: localStorage.getItem('base44_token'),
          user_email: user.email
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
        
        // Reconnect with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connect();
        }, delay);
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
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