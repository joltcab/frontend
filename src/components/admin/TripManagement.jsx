import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import joltcab from "@/lib/joltcab-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Car, Search, MapPin, DollarSign, Clock, User, X, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TripManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['allTrips'],
  queryFn: () => joltcab.entities.Ride.list('-created_date', 200),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const updateTripMutation = useMutation({
  mutationFn: ({ tripId, data }) => joltcab.entities.Ride.update(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTrips'] });
    },
  });

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.pickup_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.dropoff_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.passenger_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const colors = {
      requested: "bg-blue-100 text-blue-800",
      negotiating: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentBadge = (method) => {
    const colors = {
      cash: "bg-green-100 text-green-800",
      card: "bg-blue-100 text-blue-800",
      wallet: "bg-purple-100 text-purple-800",
    };
    return colors[method] || "bg-gray-100 text-gray-800";
  };

  const stats = {
    total: trips.length,
    active: trips.filter(t => ['requested', 'negotiating', 'accepted', 'in_progress'].includes(t.status)).length,
    completed: trips.filter(t => t.status === 'completed').length,
    cancelled: trips.filter(t => t.status === 'cancelled').length,
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trips...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Car className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <X className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Trip Management ({filteredTrips.length} trips)
          </CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by location or passenger..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="negotiating">Negotiating</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTrips.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No trips found</p>
              </div>
            ) : (
              filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusBadge(trip.status)}>
                          {trip.status}
                        </Badge>
                        {trip.payment_method && (
                          <Badge className={getPaymentBadge(trip.payment_method)}>
                            {trip.payment_method}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">Pickup</p>
                            <p className="text-gray-600">{trip.pickup_location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">Dropoff</p>
                            <p className="text-gray-600">{trip.dropoff_location}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {trip.agreed_price && (
                        <div className="mb-2">
                          <p className="text-2xl font-bold text-green-600">
                            ${trip.agreed_price}
                          </p>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 space-y-1">
                        {trip.distance_km && (
                          <div className="flex items-center gap-1 justify-end">
                            <MapPin className="w-3 h-3" />
                            {trip.distance_km} km
                          </div>
                        )}
                        {trip.duration_minutes && (
                          <div className="flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3" />
                            {trip.duration_minutes} min
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {trip.passenger_email}
                      </div>
                      {trip.driver_email && (
                        <div className="flex items-center gap-1">
                          <Car className="w-3 h-3" />
                          {trip.driver_email}
                        </div>
                      )}
                    </div>

                    {trip.status === 'requested' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTripMutation.mutate({
                          tripId: trip.id,
                          data: { status: 'cancelled' }
                        })}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}