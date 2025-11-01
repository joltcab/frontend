import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import joltcab from "@/lib/joltcab-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, DollarSign, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function CarRentalPackages({ serviceType, city }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const queryClient = useQueryClient();

  const { data: packages = [] } = useQuery({
    queryKey: ['carRentalPackages', serviceType?.id],
    queryFn: async () => {
      if (!serviceType?.id) return [];
      
      const allPackages = await joltcab.entities.CarRentalPackage.list();
      return allPackages.filter(p => p.service_type_id === serviceType.id && p.business_status);
    },
    enabled: !!serviceType?.id
  });

  const bookPackageMutation = useMutation({
    mutationFn: async (packageData) => {
      const user = await joltcab.auth.me();
      
      return joltcab.entities.Ride.create({
        passenger_email: user.email,
        service_type_id: serviceType.id,
        rental_package_id: packageData.id,
        rental_package_name: packageData.package_name,
        rental_base_hours: packageData.time_for_base_price / 60,
        rental_base_km: packageData.distance_for_base_price,
        agreed_price: packageData.base_price,
        status: 'requested',
        payment_method: 'card',
        pickup_location: city?.name || 'City Center',
        dropoff_location: 'Rental - Multiple Stops'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      alert('Package booked successfully! Driver will be assigned shortly.');
      setSelectedPackage(null);
    }
  });

  if (!packages.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No rental packages available for this service type</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg, index) => (
        <motion.div
          key={pkg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-xl transition-all border-2 hover:border-[#15B46A]">
            <CardHeader className="bg-gradient-to-br from-[#15B46A]/10 to-[#0F9456]/10">
              <CardTitle className="flex items-center justify-between">
                <span>{pkg.package_name}</span>
                <Badge className="bg-[#15B46A] text-white">
                  ${pkg.base_price}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-[#15B46A]" />
                  <span className="text-sm">
                    {pkg.time_for_base_price / 60} hours included
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-[#15B46A]" />
                  <span className="text-sm">
                    {pkg.distance_for_base_price} km included
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4 text-[#15B46A]" />
                  <span className="text-sm">
                    ${pkg.price_per_unit_time}/min extra
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4 text-[#15B46A]" />
                  <span className="text-sm">
                    ${pkg.price_per_unit_distance}/km extra
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-xs text-gray-500">
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-green-600 mt-0.5" />
                  <span>Multiple stops allowed</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-green-600 mt-0.5" />
                  <span>Flexible scheduling</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-green-600 mt-0.5" />
                  <span>Professional driver included</span>
                </div>
              </div>

              <Button
                onClick={() => bookPackageMutation.mutate(pkg)}
                disabled={bookPackageMutation.isPending}
                className="w-full bg-gradient-to-r from-[#15B46A] to-[#0F9456] hover:from-[#0F9456] hover:to-[#15B46A]"
              >
                {bookPackageMutation.isPending ? (
                  'Booking...'
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Book Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}