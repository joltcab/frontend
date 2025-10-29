import React from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, User, Phone, DollarSign, Eye, X, Map as MapIcon } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";

export default function DispatcherRidesList({ rides, onRefresh, dispatcherEmail }) {
  const cancelMutation = useMutation({
    mutationFn: async (rideId) => {
      await base44.functions.invoke('cancelRide', {
        ride_id: rideId,
        reason: 'cancelled_by_dispatcher'
      });
    },
    onSuccess: () => {
      onRefresh();
    },
  });

  const handleCancel = (rideId, status) => {
    // Only allow cancellation for certain statuses
    if (['completed', 'cancelled'].includes(status)) {
      alert('Cannot cancel this ride');
      return;
    }

    if (window.confirm('Are you sure you want to cancel this ride?')) {
      cancelMutation.mutate(rideId);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      requested: { label: "Requested", class: "bg-yellow-500" },
      accepted: { label: "Accepted", class: "bg-blue-500" },
      in_progress: { label: "In Progress", class: "bg-green-500" },
      completed: { label: "Completed", class: "bg-gray-500" },
      cancelled: { label: "Cancelled", class: "bg-red-500" },
    };
    
    const badge = badges[status] || badges.requested;
    return <Badge className={badge.class}>{badge.label}</Badge>;
  };

  const getPaymentBadge = (paymentMethod) => {
    const badges = {
      cash: { label: "Cash", class: "bg-green-100 text-green-800" },
      card: { label: "Card", class: "bg-blue-100 text-blue-800" },
      wallet: { label: "Wallet", class: "bg-purple-100 text-purple-800" },
    };
    
    const badge = badges[paymentMethod] || badges.cash;
    return <Badge className={badge.class}>{badge.label}</Badge>;
  };

  if (!rides || rides.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500">No active rides at the moment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {rides.map((ride, index) => (
        <motion.div
          key={ride.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Status and Time */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {getStatusBadge(ride.status)}
                    {ride.payment_method && getPaymentBadge(ride.payment_method)}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {format(new Date(ride.created_date), 'MMM d, h:mm a')}
                    </div>
                  </div>

                  {/* Passenger Info */}
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{ride.passenger_email}</span>
                  </div>

                  {/* Driver Info */}
                  {ride.driver_email && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Driver: {ride.driver_email}</span>
                    </div>
                  )}

                  {/* Locations */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                      <span className="text-gray-700">{ride.pickup_location}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                      <span className="text-gray-700">{ride.dropoff_location}</span>
                    </div>
                  </div>

                  {/* Price */}
                  {ride.agreed_price && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#15B46A]">
                      <DollarSign className="w-4 h-4" />
                      ${ride.agreed_price.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = createPageUrl(`RideDetail?id=${ride.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = createPageUrl(`TrackRide?ride_id=${ride.id}`)}
                  >
                    <MapIcon className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>

                  {ride.status !== 'completed' && ride.status !== 'cancelled' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(ride.id, ride.status)}
                      disabled={cancelMutation.isPending}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}