import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Clock,
  DollarSign,
  User,
  Calendar,
  Download,
  ArrowLeft,
  CheckCircle,
  FileText,
  CreditCard,
  Wallet,
  Banknote,
  Gift,
  Tag,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function RideDetail() {
  const [user, setUser] = useState(null);
  const [rideId, setRideId] = useState(null);

  useEffect(() => {
    loadUser();
    const params = new URLSearchParams(window.location.search);
    setRideId(params.get("ride_id"));
  }, []);

  const loadUser = async () => {
    try {
  const userData = await joltcab.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user");
    }
  };

  const { data: ride, isLoading } = useQuery({
    queryKey: ["ride", rideId],
    queryFn: async () => {
  const rides = await joltcab.entities.Ride.filter({ id: rideId });
      return rides[0];
    },
    enabled: !!rideId,
  });

  const exportToPDF = async () => {
    try {
  const response = await joltcab.functions.invoke('exportRideInvoice', {
        ride_id: rideId
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${rideId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("PDF export is not configured yet");
    }
  };

  if (isLoading || !ride) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  // Calculate pricing breakdown
  const basePrice = 6;
  const distancePrice = (ride.distance_km || 10) * 1.75;
  const timePrice = (ride.duration_minutes || 20) * 0.25;
  const waitTimePrice = 0;
  const serviceTotal = basePrice + distancePrice + timePrice + waitTimePrice;
  
  const tax = serviceTotal * 0.05;
  const surge = 0; // TODO: Get from ride data
  const userTax = 0;
  const userMiscFee = 1;
  const tipAmount = 0; // TODO: Get from ride data
  const tollAmount = 0; // TODO: Get from ride data
  
  const tripTotal = serviceTotal + tax + surge + userTax + userMiscFee + tipAmount + tollAmount;
  
  const promoBonus = 0; // TODO: Get from ride data
  const referralBonus = 0; // TODO: Get from ride data
  
  const finalTotal = tripTotal - promoBonus - referralBonus;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => window.location.href = createPageUrl("RideHistory")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </Button>
        <Button onClick={exportToPDF} className="gap-2 bg-[#15B46A] hover:bg-[#0F9456]">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>

      {/* Invoice Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
              <p className="text-sm text-gray-500 mt-1">
                Invoice #{ride.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {format(new Date(ride.created_date), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Passenger Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#15B46A]" />
                Passenger Details
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Name:</span> {user?.full_name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
              </div>
            </div>

            {/* Driver Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#15B46A]" />
                Driver Details
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {ride.driver_email || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-[#15B46A]" />
              Trip Route
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Pickup Address</p>
              <p className="text-sm text-gray-900">{ride.pickup_location}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Destination Address</p>
              <p className="text-sm text-gray-900">{ride.dropoff_location}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-[#15B46A]" />
              Trip Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {ride.distance_km?.toFixed(1) || "10.5"}
                </p>
                <p className="text-xs text-gray-600 mt-1">km</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {ride.duration_minutes || "25"}
                </p>
                <p className="text-xs text-gray-600 mt-1">mins</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">0</p>
                <p className="text-xs text-gray-600 mt-1">wait mins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-[#15B46A]" />
            Trip Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Requested</p>
              <p className="text-sm font-semibold text-gray-900">
                {format(new Date(ride.created_date), "h:mm:ss a")}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Accepted</p>
              <p className="text-sm font-semibold text-gray-900">
                {ride.accepted_at ? format(new Date(ride.accepted_at), "h:mm:ss a") : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Started</p>
              <p className="text-sm font-semibold text-gray-900">
                {ride.started_at ? format(new Date(ride.started_at), "h:mm:ss a") : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Completed</p>
              <p className="text-sm font-semibold text-gray-900">
                {ride.completed_at ? format(new Date(ride.completed_at), "h:mm:ss a") : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-[#15B46A]" />
            Invoice Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Service Charges */}
            <div className="space-y-2 pb-3 border-b">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Price</span>
                <span className="font-semibold">${basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Distance Price ({ride.distance_km?.toFixed(1) || "10.5"} km)</span>
                <span className="font-semibold">${distancePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time Price ({ride.duration_minutes || "20"} mins)</span>
                <span className="font-semibold">${timePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Wait Time Price (0 mins)</span>
                <span className="font-semibold">${waitTimePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t">
                <span className="text-gray-900">Service Total</span>
                <span className="text-gray-900">${serviceTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Additional Charges */}
            <div className="space-y-2 pb-3 border-b">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (5%)</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              {surge > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-orange-600" />
                    Surge Pricing
                  </span>
                  <span className="font-semibold text-orange-600">${surge.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-semibold">${userMiscFee.toFixed(2)}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Gift className="w-3 h-3 text-yellow-600" />
                    Tip
                  </span>
                  <span className="font-semibold text-yellow-600">${tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold pt-2 border-t">
                <span className="text-gray-900">Trip Total</span>
                <span className="text-gray-900">${tripTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Discounts */}
            {(promoBonus > 0 || referralBonus > 0) && (
              <div className="space-y-2 pb-3 border-b">
                {promoBonus > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-green-600" />
                      Promo Bonus
                    </span>
                    <span className="font-semibold text-green-600">-${promoBonus.toFixed(2)}</span>
                  </div>
                )}
                {referralBonus > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Gift className="w-3 h-3 text-green-600" />
                      Referral Bonus
                    </span>
                    <span className="font-semibold text-green-600">-${referralBonus.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Final Total */}
            <div className="flex justify-between text-xl font-bold pt-2">
              <span className="text-gray-900">TOTAL</span>
              <span className="text-[#15B46A]">${(ride.agreed_price || finalTotal).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="w-5 h-5 text-[#15B46A]" />
            Payment Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <Wallet className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Wallet Payment</p>
              <p className="text-lg font-bold text-purple-600">$0.00</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <CreditCard className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Card Payment</p>
              <p className="text-lg font-bold text-blue-600">
                ${ride.payment_method === 'card' ? (ride.agreed_price || 0).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <Banknote className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Cash Payment</p>
              <p className="text-lg font-bold text-green-600">
                ${ride.payment_method === 'cash' ? (ride.agreed_price || 0).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <AlertCircle className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className="text-lg font-bold text-gray-600">$0.00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver Earnings (if admin/driver view) */}
      {user?.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5 text-[#15B46A]" />
              Driver Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fees</span>
                <span className="font-semibold">${serviceTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Provider Tax</span>
                <span className="font-semibold text-red-600">-${(serviceTotal * 0.03).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Toll Amount</span>
                <span className="font-semibold text-green-600">+${tollAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Commission (15%)</span>
                <span className="font-semibold text-red-600">-${(serviceTotal * 0.15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span className="text-gray-900">Driver Earnings</span>
                <span className="text-[#15B46A]">${(serviceTotal * 0.82).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Badge */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3">
            {ride.status === 'completed' ? (
              <>
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">Trip Completed</p>
                  <p className="text-sm text-gray-600">Thank you for riding with JoltCab!</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600 capitalize">{ride.status}</p>
                  <p className="text-sm text-gray-600">Trip was {ride.status}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}