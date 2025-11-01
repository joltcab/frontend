import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import joltcab from "@/lib/joltcab-api";
import { Zap, ZapOff } from "lucide-react";
import { motion } from "framer-motion";

export default function OnlineToggle({ driverEmail, isOnline }) {
  const queryClient = useQueryClient();

  const toggleOnlineMutation = useMutation({
    mutationFn: async (online) => {
  const profiles = await joltcab.entities.DriverProfile.filter({
        user_email: driverEmail 
      });
      
      if (profiles[0]) {
  await joltcab.entities.DriverProfile.update(profiles[0].id, {
          is_online: online,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driverProfile'] });
    },
  });

  const handleToggle = (checked) => {
    if (checked && !navigator.geolocation) {
      alert("Location services are required to go online. Please enable location in your browser.");
      return;
    }
    toggleOnlineMutation.mutate(checked);
  };

  return (
    <Card className={`border-2 ${isOnline ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              animate={isOnline ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isOnline 
                  ? 'bg-gradient-to-br from-green-500 to-green-600' 
                  : 'bg-gray-300'
              }`}
            >
              {isOnline ? (
                <Zap className="w-8 h-8 text-white" />
              ) : (
                <ZapOff className="w-8 h-8 text-gray-600" />
              )}
            </motion.div>

            <div>
              <p className="text-xl font-bold text-gray-900">
                {isOnline ? "You're Online" : "You're Offline"}
              </p>
              <p className="text-sm text-gray-600">
                {isOnline 
                  ? "Ready to accept ride requests" 
                  : "Toggle to start receiving requests"}
              </p>
              {isOnline && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Location tracking active
                </p>
              )}
            </div>
          </div>

          <Switch
            checked={isOnline}
            onCheckedChange={handleToggle}
            disabled={toggleOnlineMutation.isPending}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </CardContent>
    </Card>
  );
}