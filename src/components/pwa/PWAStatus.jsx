import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Wifi, WifiOff } from "lucide-react";

export default function PWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      {isInstalled && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Smartphone className="w-3 h-3" />
          <span className="text-xs">App Mode</span>
        </Badge>
      )}
      <Badge 
        variant="outline" 
        className={`flex items-center gap-1 ${
          isOnline ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className="w-3 h-3" />
            <span className="text-xs">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            <span className="text-xs">Offline</span>
          </>
        )}
      </Badge>
    </div>
  );
}