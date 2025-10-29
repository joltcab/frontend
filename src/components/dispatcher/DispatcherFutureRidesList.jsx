import React from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, User, X, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";

export default function DispatcherFutureRidesList({ scheduledRides, onRefresh }) {
  const cancelMutation = useMutation({
    mutationFn: async (scheduleId) => {
      const schedules = await base44.entities.ScheduledRide.filter({ id: scheduleId });
      if (schedules[0]) {
        await base44.entities.ScheduledRide.update(scheduleId, {
          status: 'cancelled'
        });
      }
    },
    onSuccess: () => {
      onRefresh();
    },
  });

  const handleCancel = (scheduleId) => {
    if (window.confirm('Are you sure you want to cancel this scheduled ride?')) {
      cancelMutation.mutate(scheduleId);
    }
  };

  if (!scheduledRides || scheduledRides.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No scheduled rides at the moment</p>
          <p className="text-gray-400 text-sm mt-2">Future ride requests will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {scheduledRides.map((scheduled, index) => {
        const ride = scheduled.ride_details;
        
        return (
          <motion.div
            key={scheduled.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Scheduled Time */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className="bg-purple-500">Scheduled</Badge>
                      <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(scheduled.scheduled_datetime), 'MMM d, yyyy')}
                        <Clock className="w-4 h-4 ml-2" />
                        {format(new Date(scheduled.scheduled_datetime), 'h:mm a')}
                      </div>
                    </div>

                    {/* Passenger Info */}
                    {ride && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{ride.passenger_email}</span>
                        </div>

                        {/* Locations */}
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{ride.pickup_location}</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{ride.dropoff_location}</span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Advance Notification Status */}
                    {scheduled.driver_assigned && (
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Driver Assigned
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    {ride && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = createPageUrl(`RideDetail?id=${ride.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    )}
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(scheduled.id)}
                      disabled={cancelMutation.isPending}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}