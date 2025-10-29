import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, Navigation, User, Phone, MessageCircle,
  CheckCircle, XCircle 
} from "lucide-react";
import GoogleMapLoader from "../maps/GoogleMapLoader";
import RouteMap from "../maps/RouteMap";

export default function ActiveRideTracker({ ride, onStartRide, onCompleteRide, onCancelRide }) {
  const isEnRoute = ride.status === 'accepted';
  const isInProgress = ride.status === 'in_progress';

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card className="border-2 border-[#15B46A]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-[#15B46A]">
              {isEnRoute ? "En Route to Pickup" : "Trip in Progress"}
            </Badge>
            <span className="text-sm text-gray-600">
              {new Date(ride.created_date).toLocaleTimeString()}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Pickup</p>
                <p className="text-sm text-gray-600">{ride.pickup_location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Dropoff</p>
                <p className="text-sm text-gray-600">{ride.dropoff_location}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <span className="font-semibold text-gray-900">Fare</span>
            <span className="text-2xl font-bold text-[#15B46A]">${ride.agreed_price}</span>
          </div>
        </CardContent>
      </Card>

      {/* Passenger Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Passenger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{ride.passenger_email}</p>
              <p className="text-sm text-gray-600">Passenger</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Phone className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GoogleMapLoader>
            <RouteMap
              pickup={{
                lat: ride.pickup_lat,
                lng: ride.pickup_lng,
                address: ride.pickup_location,
              }}
              dropoff={{
                lat: ride.dropoff_lat,
                lng: ride.dropoff_lng,
                address: ride.dropoff_location,
              }}
              height="300px"
            />
          </GoogleMapLoader>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {isEnRoute && (
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 h-14"
            onClick={onStartRide}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Start Trip
          </Button>
        )}

        {isInProgress && (
          <Button
            className="flex-1 bg-[#15B46A] hover:bg-[#0F9456] h-14"
            onClick={onCompleteRide}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Complete Trip
          </Button>
        )}

        <Button
          variant="destructive"
          className="h-14"
          onClick={onCancelRide}
        >
          <XCircle className="w-5 h-5 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}