import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  User, 
  Car, 
  CheckCircle, 
  XCircle,
  Clock,
  Eye,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DriverVerification() {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: drivers = [] } = useQuery({
    queryKey: ['driverProfiles'],
    queryFn: () => base44.entities.DriverProfile.list('-created_date', 100),
  });

  const updateDriverMutation = useMutation({
    mutationFn: ({ driverId, data }) => base44.entities.DriverProfile.update(driverId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driverProfiles'] });
      setShowDetailsDialog(false);
    },
  });

  const pendingDrivers = drivers.filter(d => d.background_check_status === 'pending');
  const approvedDrivers = drivers.filter(d => d.background_check_status === 'approved');
  const rejectedDrivers = drivers.filter(d => d.background_check_status === 'rejected');

  const handleApprove = (driver) => {
    if (confirm(`Approve driver ${driver.user_email}?`)) {
      updateDriverMutation.mutate({
        driverId: driver.id,
        data: { background_check_status: 'approved' }
      });
    }
  };

  const handleReject = (driver) => {
    if (confirm(`Reject driver ${driver.user_email}?`)) {
      updateDriverMutation.mutate({
        driverId: driver.id,
        data: { background_check_status: 'rejected' }
      });
    }
  };

  const viewDriverDetails = (driver) => {
    setSelectedDriver(driver);
    setShowDetailsDialog(true);
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { bg: "bg-yellow-100 text-yellow-800", icon: Clock },
      approved: { bg: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { bg: "bg-red-100 text-red-800", icon: XCircle },
    };
    return configs[status] || configs.pending;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingDrivers.length}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedDrivers.length}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{rejectedDrivers.length}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Drivers */}
      {pendingDrivers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Pending Verification ({pendingDrivers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingDrivers.map((driver) => (
                <DriverCard
                  key={driver.id}
                  driver={driver}
                  onView={() => viewDriverDetails(driver)}
                  onApprove={() => handleApprove(driver)}
                  onReject={() => handleReject(driver)}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Drivers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            All Drivers ({drivers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {drivers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No drivers registered yet</p>
              </div>
            ) : (
              drivers.map((driver) => (
                <DriverCard
                  key={driver.id}
                  driver={driver}
                  onView={() => viewDriverDetails(driver)}
                  onApprove={driver.background_check_status === 'pending' ? () => handleApprove(driver) : null}
                  onReject={driver.background_check_status === 'pending' ? () => handleReject(driver) : null}
                  getStatusBadge={getStatusBadge}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      {selectedDriver && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Driver Verification Details
              </DialogTitle>
              <DialogDescription>
                Review driver information and documents
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Status */}
              <div>
                <Badge className={getStatusBadge(selectedDriver.background_check_status).bg}>
                  {selectedDriver.background_check_status.toUpperCase()}
                </Badge>
              </div>

              {/* Driver Info */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Driver Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{selectedDriver.user_email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rating</p>
                    <p className="font-medium">⭐ {selectedDriver.rating || 5}/5</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Trips</p>
                    <p className="font-medium">{selectedDriver.total_trips || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Online Status</p>
                    <p className="font-medium">{selectedDriver.is_online ? '🟢 Online' : '⚫ Offline'}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Make & Model</p>
                    <p className="font-medium">{selectedDriver.vehicle_make} {selectedDriver.vehicle_model}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Year</p>
                    <p className="font-medium">{selectedDriver.vehicle_year}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Color</p>
                    <p className="font-medium">{selectedDriver.vehicle_color}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Plate</p>
                    <p className="font-medium">{selectedDriver.vehicle_plate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">VIN</p>
                    <p className="font-medium text-xs">{selectedDriver.vehicle_vin || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Seats</p>
                    <p className="font-medium">{selectedDriver.vehicle_seats || 4}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedDriver.license_front && (
                    <div className="border rounded-lg p-3">
                      <p className="text-sm text-gray-600 mb-2">License (Front)</p>
                      <img 
                        src={selectedDriver.license_front} 
                        alt="License Front"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  {selectedDriver.license_back && (
                    <div className="border rounded-lg p-3">
                      <p className="text-sm text-gray-600 mb-2">License (Back)</p>
                      <img 
                        src={selectedDriver.license_back} 
                        alt="License Back"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  {selectedDriver.insurance_doc && (
                    <div className="border rounded-lg p-3">
                      <p className="text-sm text-gray-600 mb-2">Insurance</p>
                      <a 
                        href={selectedDriver.insurance_doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Photos */}
              {selectedDriver.vehicle_photos && selectedDriver.vehicle_photos.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Vehicle Photos
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedDriver.vehicle_photos.map((photo, index) => (
                      <img 
                        key={index}
                        src={photo} 
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedDriver.background_check_status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(selectedDriver)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Driver
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleReject(selectedDriver)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Driver Card Component
function DriverCard({ driver, onView, onApprove, onReject, getStatusBadge }) {
  const statusConfig = getStatusBadge(driver.background_check_status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {driver.user_email?.charAt(0).toUpperCase() || "D"}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{driver.user_email}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Car className="w-3 h-3" />
              <span>{driver.vehicle_make} {driver.vehicle_model}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                ⭐ {driver.rating || 5}/5
              </span>
              <span>•</span>
              <span>{driver.total_trips || 0} trips</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={statusConfig.bg}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {driver.background_check_status}
          </Badge>

          <Button
            size="sm"
            variant="outline"
            onClick={onView}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>

          {onApprove && (
            <>
              <Button
                size="sm"
                onClick={onApprove}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onReject}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}