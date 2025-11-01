
import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Car, MapPin, Calendar, Clock, DollarSign, Loader2, Navigation, Users, Briefcase, AlertCircle } from "lucide-react";
import GoogleMapLoader from "../maps/GoogleMapLoader";
import AddressAutocomplete from "../maps/AddressAutocomplete";
import RouteMap from "../maps/RouteMap";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RideBookingDialog({ isOpen, onClose, user }) {
  const [bookingType, setBookingType] = useState("now");
  const [pickupLocation, setPickupLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [luggageCount, setLuggageCount] = useState(0);
  const [selectedService, setSelectedService] = useState(null); // Will hold { service: ServiceTypeObject, price: number, minPrice: number, maxPrice: number }
  const [offerPrice, setOfferPrice] = useState("");
  const [advancedFare, setAdvancedFare] = useState(null); // NEW
  const [routeDetails, setRouteDetails] = useState(null); // NEW
  const [loadingFare, setLoadingFare] = useState(false); // NEW
  const [priceError, setPriceError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const queryClient = useQueryClient();

  // Fetch active service types
  const { data: serviceTypes = [] } = useQuery({
    queryKey: ['activeServiceTypes'],
  queryFn: () => joltcab.entities.ServiceType.filter({ business_status: true }),
  });

  // Fetch cities for filtering
  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
  queryFn: () => joltcab.entities.City.filter({ business_status: true }),
  });

  const createRideMutation = useMutation({
  mutationFn: (data) => joltcab.entities.Ride.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRides'] });
      onClose();
      resetForm();
      alert("Ride requested successfully! A driver will respond soon.");
    },
  });

  // Reset form
  const resetForm = () => {
    setPickupLocation(null);
    setPickupAddress("");
    setDropoffLocation(null);
    setDropoffAddress("");
    setScheduledDate("");
    setScheduledTime("");
    setPassengerCount(1);
    setLuggageCount(0);
    setSelectedService(null);
    setOfferPrice("");
    setAdvancedFare(null); // NEW
    setRouteDetails(null); // NEW
    setPriceError("");
  };

  // Calculate advanced fare when locations or selected service change
  useEffect(() => {
    if (pickupLocation && dropoffLocation && selectedService?.service && cities.length > 0) {
      calculateAdvancedFare();
    } else {
      // Clear fare details if conditions are not met
      setAdvancedFare(null);
      setRouteDetails(null);
      setSelectedService(prev => prev ? { ...prev, price: 0, minPrice: 0, maxPrice: 0 } : null);
      setOfferPrice("");
      setPriceError("");
    }
  }, [pickupLocation, dropoffLocation, selectedService?.service?.id, cities, bookingType, scheduledDate, scheduledTime]);


  const calculateAdvancedFare = async () => {
    setLoadingFare(true);
    try {
      // Get city_id from user or default to first city
      const cityId = cities[0]?.id;
      
      if (!cityId) {
        console.error("No city configured");
        setLoadingFare(false);
        return;
      }

      const scheduledDateTime = (bookingType === "schedule" && scheduledDate && scheduledTime)
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        : null;

  const { data } = await joltcab.functions.invoke('calculateAdvancedFare', {
        pickup: {
          lat: pickupLocation.lat,
          lng: pickupLocation.lng
        },
        dropoff: {
          lat: dropoffLocation.lat,
          lng: dropoffLocation.lng
        },
        service_type_id: selectedService.service.id,
        city_id: cityId,
        scheduled_time: scheduledDateTime
      });

      if (data.success) {
        setAdvancedFare(data.fare);
        setRouteDetails(data.route);
        setOfferPrice(data.fare.total.toFixed(2));
        
        // Update selected service with calculated price
        setSelectedService(prev => ({
          ...prev, // Keep the service object
          price: data.fare.total,
          minPrice: data.fare.total * 0.90,
          maxPrice: data.fare.total * 1.50
        }));
        setPriceError(""); // Clear any previous price error
      } else {
        console.error("Advanced fare calculation failed:", data.error);
        setAdvancedFare(null);
        setRouteDetails(null);
        setSelectedService(prev => prev ? { ...prev, price: 0, minPrice: 0, maxPrice: 0 } : null);
        setOfferPrice("");
        setPriceError(data.error || "Failed to calculate fare. Please try again.");
      }
    } catch (error) {
      console.error("Error calculating advanced fare:", error);
      setAdvancedFare(null);
      setRouteDetails(null);
      setSelectedService(prev => prev ? { ...prev, price: 0, minPrice: 0, maxPrice: 0 } : null);
      setOfferPrice("");
      setPriceError("An unexpected error occurred during fare calculation.");
    } finally {
      setLoadingFare(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Use Google Maps Geocoding to get address
          if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              setLoadingLocation(false);
              if (status === 'OK' && results[0]) {
                const address = results[0].formatted_address;
                setPickupLocation({
                  address: address,
                  lat,
                  lng,
                  place_id: results[0].place_id,
                });
                setPickupAddress(address); // Update address input value
              } else {
                // Fallback to coordinates
                const coordAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                setPickupLocation({
                  address: coordAddress,
                  lat,
                  lng,
                });
                setPickupAddress(coordAddress); // Update address input value
              }
            });
          } else {
            setLoadingLocation(false);
            const coordAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setPickupLocation({
              address: coordAddress,
              lat,
              lng,
            });
            setPickupAddress(coordAddress); // Update address input value
          }
        },
        (error) => {
          setLoadingLocation(false);
          alert("Unable to get your location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handlePickupSelected = (location) => {
    setPickupLocation(location);
    setPickupAddress(location ? location.address : ""); // Update both location object and input string
  };

  const handleDropoffSelected = (location) => {
    setDropoffLocation(location);
    setDropoffAddress(location ? location.address : ""); // Update both location object and input string
  };

  const handleServiceSelect = (serviceType) => {
    // Set the service type, reset price info, and trigger fare calculation via useEffect
    setSelectedService({ service: serviceType, price: 0, minPrice: 0, maxPrice: 0 });
    setOfferPrice("");
    setPriceError("");
  };

  const handlePriceChange = (value) => {
    setOfferPrice(value);
    
    if (selectedService && value) {
      const numValue = parseFloat(value);
      if (numValue < selectedService.minPrice) {
        setPriceError(`Minimum price is $${selectedService.minPrice.toFixed(2)}`);
      } else if (numValue > selectedService.maxPrice) {
        setPriceError(`Maximum price is $${selectedService.maxPrice.toFixed(2)}`);
      } else {
        setPriceError("");
      }
    } else {
      setPriceError("");
    }
  };

  const handleBookViaApp = () => {
    if (!pickupLocation || !dropoffLocation) {
      alert("Please select pickup and dropoff locations");
      return;
    }

    if (!selectedService || !selectedService.service || !advancedFare) {
      alert("Please select a service type and ensure fare is calculated.");
      return;
    }

    const numPrice = parseFloat(offerPrice);
    if (!numPrice || numPrice < selectedService.minPrice || numPrice > selectedService.maxPrice) {
      alert(`Price must be between $${selectedService.minPrice.toFixed(2)} and $${selectedService.maxPrice.toFixed(2)}`);
      return;
    }

    const rideData = {
      passenger_email: user.email,
      pickup_location: pickupLocation.address,
      pickup_lat: pickupLocation.lat,
      pickup_lng: pickupLocation.lng,
      dropoff_location: dropoffLocation.address,
      dropoff_lat: dropoffLocation.lat,
      dropoff_lng: dropoffLocation.lng,
      passenger_offer: numPrice,
      status: "requested",
      service_type_id: selectedService.service.id,
      distance_km: routeDetails?.distance_km || null,
      duration_minutes: routeDetails?.duration_minutes || null,
      scheduled_date: bookingType === "schedule" ? scheduledDate : null,
      scheduled_time: bookingType === "schedule" ? scheduledTime : null,
    };

    createRideMutation.mutate(rideData);
  };

  const handleBookViaWhatsApp = () => {
    const pickup = pickupLocation?.address || "Not set";
    const dropoff = dropoffLocation?.address || "Not set";
    const when = bookingType === "now" ? "Right now" : `${scheduledDate} at ${scheduledTime}`;
    const serviceName = selectedService?.service.name || "Standard";
    const price = offerPrice || "Not specified";
    
    const message = `Hello JoltCab! I need a ride:\n\n` +
                   `📍 Pickup: ${pickup}\n` +
                   `📍 Dropoff: ${dropoff}\n` +
                   `🕐 When: ${when}\n` +
                   `🚗 Service: ${serviceName}\n` +
                   `👥 Passengers: ${passengerCount}\n` +
                   `💼 Luggage: ${luggageCount}\n` +
                   `💰 My offer: $${price}\n\n` +
                   `Please confirm availability.`;
    
    const whatsappUrl = `https://wa.me/14707484747?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Book Your Ride</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="app" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="app" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Book via App
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Book via WhatsApp
            </TabsTrigger>
          </TabsList>

          {/* App Booking */}
          <TabsContent value="app" className="space-y-6 mt-6">
            {/* Step 1: Booking Type */}
            <Card>
              <CardContent className="pt-6">
                <Label className="text-base font-semibold mb-3 block">When do you need the ride?</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={bookingType === "now" ? "default" : "outline"}
                    onClick={() => setBookingType("now")}
                    className={bookingType === "now" ? "bg-[#15B46A] hover:bg-[#0F9456]" : ""}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Now
                  </Button>
                  <Button
                    type="button"
                    variant={bookingType === "schedule" ? "default" : "outline"}
                    onClick={() => setBookingType("schedule")}
                    className={bookingType === "schedule" ? "bg-[#15B46A] hover:bg-[#0F9456]" : ""}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </div>

                {bookingType === "schedule" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="grid md:grid-cols-2 gap-4 mt-4"
                  >
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Locations */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                      <MapPin className="w-4 h-4 text-green-600" />
                      Pickup Location
                    </Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleUseCurrentLocation}
                      disabled={loadingLocation}
                    >
                      {loadingLocation ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Navigation className="w-3 h-3 mr-1" />
                      )}
                      Use Current
                    </Button>
                  </div>
                  <GoogleMapLoader>
                    <AddressAutocomplete
                      value={pickupAddress}
                      onPlaceSelected={handlePickupSelected}
                      placeholder="Enter pickup address..."
                    />
                  </GoogleMapLoader>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2 text-base font-semibold">
                    <MapPin className="w-4 h-4 text-red-600" />
                    Dropoff Location
                  </Label>
                  <GoogleMapLoader>
                    <AddressAutocomplete
                      value={dropoffAddress}
                      onPlaceSelected={handleDropoffSelected}
                      placeholder="Enter dropoff address..."
                    />
                  </GoogleMapLoader>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Enhanced Map Preview & Route Info */}
            <AnimatePresence>
              {pickupLocation && dropoffLocation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <GoogleMapLoader>
                        <RouteMap
                          pickup={pickupLocation}
                          dropoff={dropoffLocation}
                          height="300px"
                        />
                      </GoogleMapLoader>
                      
                      {loadingFare ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
                          <span className="ml-3 text-gray-600">Calculating best route...</span>
                        </div>
                      ) : routeDetails && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-3xl font-bold text-blue-600">
                              {routeDetails.distance_km.toFixed(1)} km
                            </p>
                            <p className="text-sm text-gray-600">Distance</p>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-3xl font-bold text-purple-600">
                              {Math.round(routeDetails.duration_minutes)} min
                            </p>
                            <p className="text-sm text-gray-600">
                              {routeDetails.traffic_conditions === 'heavy' ? 'With Traffic' : 'Duration'}
                            </p>
                          </div>
                          {advancedFare?.surge_multiplier > 1 && (
                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                              <p className="text-3xl font-bold text-orange-600">
                                {advancedFare.surge_multiplier}x
                              </p>
                              <p className="text-sm text-gray-600">Surge Pricing</p>
                            </div>
                          )}
                          {advancedFare?.zone_surcharge > 0 && (
                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                              <p className="text-3xl font-bold text-yellow-600">
                                +${advancedFare.zone_surcharge.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">Zone Fee</p>
                            </div>
                          )}
                        </div>
                      )}

                      {routeDetails?.traffic_conditions === 'heavy' && (
                        <Alert className="mt-4 bg-orange-50 border-orange-200">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <AlertDescription className="text-sm text-orange-900">
                            Heavy traffic detected. Estimated time includes current traffic conditions.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 4: Service Selection */}
            <AnimatePresence>
              {(pickupLocation && dropoffLocation && serviceTypes.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <Label className="text-base font-semibold mb-4 block">Choose Your Service</Label>
                      <div className="grid md:grid-cols-3 gap-4">
                        {serviceTypes.map((serviceType, index) => (
                          <motion.div
                            key={serviceType.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <button
                              type="button"
                              onClick={() => handleServiceSelect(serviceType)}
                              className={`w-full p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                                selectedService?.service.id === serviceType.id
                                  ? 'border-[#15B46A] bg-green-50'
                                  : 'border-gray-200 hover:border-[#15B46A]'
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-4xl mb-2">🚗</div>
                                <h4 className="font-bold text-gray-900 mb-1">
                                  {serviceType.name}
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">
                                  {serviceType.description || `Up to ${serviceType.max_space} passengers`}
                                </p>
                                <div className="text-2xl font-bold text-[#15B46A]">
                                  {selectedService?.service.id === serviceType.id && advancedFare && !loadingFare ? 
                                    `$${advancedFare.total.toFixed(2)}` : 'Get Price'}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {selectedService?.service.id === serviceType.id && advancedFare && !loadingFare ? 
                                    'Calculated fare' : 'Select to view fare'}
                                </p>
                              </div>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fare Breakdown */}
            <AnimatePresence>
              {advancedFare && routeDetails && !loadingFare && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <Label className="text-base font-semibold mb-4 block">Fare Breakdown</Label>
                      
                      <div className="space-y-2 mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Base Price</span>
                          <span className="font-semibold">${advancedFare.base_price.toFixed(2)}</span>
                        </div>
                        {advancedFare.distance_charge > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Distance ({routeDetails.distance_km.toFixed(1)} km)</span>
                            <span className="font-semibold">${advancedFare.distance_charge.toFixed(2)}</span>
                          </div>
                        )}
                        {advancedFare.time_charge > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Time ({Math.round(routeDetails.duration_minutes)} min)</span>
                            <span className="font-semibold">${advancedFare.time_charge.toFixed(2)}</span>
                          </div>
                        )}
                        {advancedFare.zone_surcharge > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Zone Surcharge</span>
                            <span className="font-semibold text-orange-600">+${advancedFare.zone_surcharge.toFixed(2)}</span>
                          </div>
                        )}
                        {advancedFare.surge_multiplier > 1 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Surge ({advancedFare.surge_multiplier}x)</span>
                            <span className="font-semibold text-orange-600">Applied</span>
                          </div>
                        )}
                        {advancedFare.tax > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-semibold">${advancedFare.tax.toFixed(2)}</span>
                          </div>
                        )}
                        {advancedFare.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Discount</span>
                            <span className="font-semibold text-green-600">-${advancedFare.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                          <span>Total</span>
                          <span className="text-[#15B46A]">${advancedFare.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 5: Additional Details */}
            <AnimatePresence>
              {selectedService?.service && advancedFare && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <Label className="text-base font-semibold block">Additional Details</Label>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4" />
                            Passengers
                          </Label>
                          <Select 
                            value={String(passengerCount)} 
                            onValueChange={(v) => setPassengerCount(parseInt(v))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                <SelectItem key={n} value={String(n)}>
                                  {n} Passenger{n > 1 ? 's' : ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-4 h-4" />
                            Luggage
                          </Label>
                          <Select 
                            value={String(luggageCount)} 
                            onValueChange={(v) => setLuggageCount(parseInt(v))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4, 5].map(n => (
                                <SelectItem key={n} value={String(n)}>
                                  {n} {n === 1 ? 'Bag' : 'Bags'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4" />
                            Your Offer
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={offerPrice}
                            onChange={(e) => handlePriceChange(e.target.value)}
                            placeholder="Enter your price"
                            className={priceError ? "border-red-500" : ""}
                          />
                          {priceError && (
                            <p className="text-xs text-red-600 mt-1">{priceError}</p>
                          )}
                          {selectedService?.minPrice && selectedService?.maxPrice && (
                            <p className="text-xs text-gray-500 mt-1">
                              Range: ${selectedService.minPrice.toFixed(2)} - ${selectedService.maxPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      <Alert className="bg-blue-50 border-blue-200">
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                        <AlertDescription className="text-sm text-blue-900">
                          You can negotiate the price within 10% below to 50% above the estimated fare. 
                          Drivers can accept, counter-offer, or decline your request.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <AnimatePresence>
              {selectedService?.service && advancedFare && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    onClick={handleBookViaApp}
                    disabled={createRideMutation.isPending || !!priceError || loadingFare || !offerPrice || parseFloat(offerPrice) === 0}
                    className="w-full bg-gradient-to-r from-[#15B46A] to-[#0F9456] hover:from-[#0F9456] hover:to-[#15B46A] h-16 text-lg font-semibold shadow-xl"
                  >
                    {createRideMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Requesting Ride...
                      </>
                    ) : (
                      <>
                        <Car className="w-5 h-5 mr-2" />
                        Request Ride - ${offerPrice || '0.00'}
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* WhatsApp Booking */}
          <TabsContent value="whatsapp" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                      <MapPin className="w-4 h-4 text-green-600" />
                      Pickup Location
                    </Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleUseCurrentLocation}
                      disabled={loadingLocation}
                    >
                      {loadingLocation ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Navigation className="w-3 h-3 mr-1" />
                      )}
                      Use Current
                    </Button>
                  </div>
                  <GoogleMapLoader>
                    <AddressAutocomplete
                      value={pickupAddress}
                      onPlaceSelected={handlePickupSelected}
                      placeholder="Enter pickup address..."
                    />
                  </GoogleMapLoader>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2 text-base font-semibold">
                    <MapPin className="w-4 h-4 text-red-600" />
                    Dropoff Location
                  </Label>
                  <GoogleMapLoader>
                    <AddressAutocomplete
                      value={dropoffAddress}
                      onPlaceSelected={handleDropoffSelected}
                      placeholder="Enter dropoff address..."
                    />
                  </GoogleMapLoader>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={bookingType === "now" ? "default" : "outline"}
                    onClick={() => setBookingType("now")}
                    className={bookingType === "now" ? "bg-[#15B46A]" : ""}
                  >
                    Now
                  </Button>
                  <Button
                    type="button"
                    variant={bookingType === "schedule" ? "default" : "outline"}
                    onClick={() => setBookingType("schedule")}
                    className={bookingType === "schedule" ? "bg-[#15B46A]" : ""}
                  >
                    Schedule
                  </Button>
                </div>

                {bookingType === "schedule" && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                )}

                {serviceTypes.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Service Type</Label>
                    <Select 
                      value={selectedService?.service.id || ""} 
                      onValueChange={(id) => {
                        const service = serviceTypes.find(p => p.id === id);
                        if (service) handleServiceSelect(service);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map(serviceType => (
                          <SelectItem key={serviceType.id} value={serviceType.id}>
                            {serviceType.name}
                            {selectedService?.service.id === serviceType.id && advancedFare && !loadingFare && ` - $${advancedFare.total.toFixed(2)}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Passengers</Label>
                    <Select value={String(passengerCount)} onValueChange={(v) => setPassengerCount(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map(n => (
                          <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Luggage</Label>
                    <Select value={String(luggageCount)} onValueChange={(v) => setLuggageCount(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5].map(n => (
                          <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Your Offer ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="Price"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleBookViaWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg font-semibold"
              disabled={!pickupLocation || !dropoffLocation || !selectedService?.service || loadingFare}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Continue on WhatsApp
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
