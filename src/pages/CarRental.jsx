import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, MapPin, Info } from "lucide-react";
import CarRentalPackages from "../components/rental/CarRentalPackages";

export default function CarRental() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: () => base44.entities.City.list(),
  });

  const { data: serviceTypes = [] } = useQuery({
    queryKey: ['serviceTypes'],
    queryFn: () => base44.entities.ServiceType.list(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Car Rental Packages
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Rent a car with a driver for hours. Perfect for city tours, shopping trips, or business meetings.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Select Your Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <Select
                  value={selectedCity?.id}
                  onValueChange={(value) => {
                    const city = cities.find(c => c.id === value);
                    setSelectedCity(city);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.filter(c => c.business_status).map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                <Select
                  value={selectedServiceType?.id}
                  onValueChange={(value) => {
                    const type = serviceTypes.find(st => st.id === value);
                    setSelectedServiceType(type);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.filter(st => st.business_status).map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name} - {type.max_space} seats
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Choose a package based on your needs</li>
                  <li>• A professional driver will be assigned to you</li>
                  <li>• Make multiple stops within the time limit</li>
                  <li>• Extra time/distance charged per package rates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packages */}
        {selectedCity && selectedServiceType ? (
          <CarRentalPackages
            serviceType={selectedServiceType}
            city={selectedCity}
          />
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Please select a city and vehicle type to see available packages</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}