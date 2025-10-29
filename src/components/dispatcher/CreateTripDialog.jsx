import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MapPin, Calendar, Clock, User } from "lucide-react";
import AddressAutocomplete from "../maps/AddressAutocomplete";

export default function CreateTripDialog({ open, onClose, dispatcherEmail, onSuccess }) {
  const [formData, setFormData] = useState({
    passenger_email: "",
    passenger_phone: "",
    passenger_name: "",
    pickup_location: "",
    pickup_lat: null,
    pickup_lng: null,
    dropoff_location: "",
    dropoff_lat: null,
    dropoff_lng: null,
    scheduled_date: "",
    scheduled_time: "",
    service_type_id: "",
    notes: ""
  });

  const [error, setError] = useState("");

  // Get service types
  const { data: serviceTypes = [] } = useQuery({
    queryKey: ['serviceTypes'],
    queryFn: () => base44.entities.ServiceType.filter({ business_status: true }),
  });

  // Get all users for passenger selection
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.filter({ role: 'user' }),
  });

  const createTripMutation = useMutation({
    mutationFn: async (data) => {
      // Create or get passenger
      let passengerEmail = data.passenger_email;
      
      if (!passengerEmail && data.passenger_phone) {
        // Create guest user
        const { data: result } = await base44.functions.invoke('createGuestPassenger', {
          phone: data.passenger_phone,
          name: data.passenger_name
        });
        passengerEmail = result.email;
      }

      // Create ride
      const rideData = {
        passenger_email: passengerEmail,
        pickup_location: data.pickup_location,
        pickup_lat: data.pickup_lat,
        pickup_lng: data.pickup_lng,
        dropoff_location: data.dropoff_location,
        dropoff_lat: data.dropoff_lat,
        dropoff_lng: data.dropoff_lng,
        service_type_id: data.service_type_id,
        status: 'requested',
        dispatcher_email: dispatcherEmail
      };

      const ride = await base44.entities.Ride.create(rideData);

      // If scheduled, create scheduled ride
      if (data.scheduled_date && data.scheduled_time) {
        const scheduledDatetime = `${data.scheduled_date}T${data.scheduled_time}:00`;
        
        await base44.entities.ScheduledRide.create({
          ride_id: ride.id,
          passenger_email: passengerEmail,
          scheduled_datetime: scheduledDatetime,
          status: 'pending'
        });
      } else {
        // Find nearby drivers immediately
        await base44.functions.invoke('findNearbyDrivers', {
          ride_id: ride.id,
          pickup_lat: data.pickup_lat,
          pickup_lng: data.pickup_lng
        });
      }

      return ride;
    },
    onSuccess: () => {
      onSuccess();
      setFormData({
        passenger_email: "",
        passenger_phone: "",
        passenger_name: "",
        pickup_location: "",
        pickup_lat: null,
        pickup_lng: null,
        dropoff_location: "",
        dropoff_lat: null,
        dropoff_lng: null,
        scheduled_date: "",
        scheduled_time: "",
        service_type_id: "",
        notes: ""
      });
      setError("");
    },
    onError: (error) => {
      setError(error.message || "Failed to create trip");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.pickup_location || !formData.dropoff_location) {
      setError("Please select pickup and dropoff locations");
      return;
    }

    if (!formData.passenger_email && !formData.passenger_phone) {
      setError("Please select a passenger or enter phone number");
      return;
    }

    if (!formData.service_type_id) {
      setError("Please select a service type");
      return;
    }

    createTripMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Trip</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Passenger Selection */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Passenger Information
            </h3>
            
            <div>
              <Label>Select Existing Passenger</Label>
              <Select
                value={formData.passenger_email}
                onValueChange={(value) => setFormData({ ...formData, passenger_email: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose passenger..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.email} value={user.email}>
                      {user.full_name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-center text-sm text-gray-500">OR</div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Guest Name</Label>
                <Input
                  placeholder="John Doe"
                  value={formData.passenger_name}
                  onChange={(e) => setFormData({ ...formData, passenger_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Guest Phone</Label>
                <Input
                  placeholder="+1 555-1234"
                  value={formData.passenger_phone}
                  onChange={(e) => setFormData({ ...formData, passenger_phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                Pickup Location *
              </Label>
              <AddressAutocomplete
                value={formData.pickup_location}
                onPlaceSelect={(place) => {
                  setFormData({
                    ...formData,
                    pickup_location: place.address,
                    pickup_lat: place.lat,
                    pickup_lng: place.lng
                  });
                }}
                placeholder="Enter pickup address..."
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                Dropoff Location *
              </Label>
              <AddressAutocomplete
                value={formData.dropoff_location}
                onPlaceSelect={(place) => {
                  setFormData({
                    ...formData,
                    dropoff_location: place.address,
                    dropoff_lat: place.lat,
                    dropoff_lng: place.lng
                  });
                }}
                placeholder="Enter dropoff address..."
              />
            </div>
          </div>

          {/* Service Type */}
          <div>
            <Label>Service Type *</Label>
            <Select
              value={formData.service_type_id}
              onValueChange={(value) => setFormData({ ...formData, service_type_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type..." />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Schedule (Optional) */}
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule for Later (Optional)
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={formData.scheduled_time}
                  onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Any special instructions..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTripMutation.isPending}
              className="flex-1 bg-[#15B46A] hover:bg-[#0F9456]"
            >
              {createTripMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Trip"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}