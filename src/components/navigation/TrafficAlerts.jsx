import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock, Navigation, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrafficAlerts({ route }) {
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    if (!route) return;

    // Parse traffic data from Google Maps Directions API
    const trafficAlerts = [];

    // Check for traffic delays
    if (route.legs && route.legs[0]) {
      const leg = route.legs[0];
      
      // Duration in traffic vs normal duration
      if (leg.duration_in_traffic && leg.duration) {
        const delay = leg.duration_in_traffic.value - leg.duration.value;
        
        if (delay > 300) { // More than 5 minutes delay
          trafficAlerts.push({
            id: 'traffic-delay',
            type: 'warning',
            icon: Clock,
            title: 'Tráfico Pesado',
            message: `Demora de ${Math.round(delay / 60)} minutos extra por tráfico`,
            color: 'bg-orange-100 text-orange-800 border-orange-300'
          });
        }
      }

      // Check for warnings in route
      if (leg.warnings && leg.warnings.length > 0) {
        leg.warnings.forEach((warning, idx) => {
          trafficAlerts.push({
            id: `warning-${idx}`,
            type: 'info',
            icon: AlertTriangle,
            title: 'Aviso de Ruta',
            message: warning,
            color: 'bg-blue-100 text-blue-800 border-blue-300'
          });
        });
      }
    }

    setAlerts(trafficAlerts);
  }, [route]);

  const dismissAlert = (alertId) => {
    setDismissed([...dismissed, alertId]);
  };

  const visibleAlerts = alerts.filter(alert => !dismissed.includes(alert.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-40 px-4 space-y-2">
      <AnimatePresence>
        {visibleAlerts.map((alert) => {
          const Icon = alert.icon;
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`
                ${alert.color}
                max-w-md mx-auto p-4 rounded-lg shadow-lg border-2
                flex items-start gap-3
              `}
            >
              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">{alert.title}</p>
                <p className="text-sm">{alert.message}</p>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="p-1 hover:bg-black/10 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}