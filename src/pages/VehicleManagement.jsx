import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Car,
  Plus,
  Edit,
  FileText,
  AlertCircle,
  CheckCircle,
  MoreVertical,
  Trash2,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function VehicleManagement() {
  const [user, setUser] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
  const userData = await joltcab.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user");
    }
  };

  // Fetch vehicles
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles", user?.email],
  queryFn: () => joltcab.entities.Vehicle.filter({ driver_email: user.email }),
    enabled: !!user,
  });

  // Fetch service types
  const { data: serviceTypes = [] } = useQuery({
    queryKey: ["serviceTypes"],
  queryFn: () => joltcab.entities.ServiceType.filter({ business_status: true }),
  });

  // Add/Update vehicle mutation
  const vehicleMutation = useMutation({
    mutationFn: async (vehicleData) => {
      if (editingVehicle) {
  return joltcab.entities.Vehicle.update(editingVehicle.id, vehicleData);
      } else {
  return joltcab.entities.Vehicle.create(vehicleData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      setShowAddDialog(false);
      setEditingVehicle(null);
    },
  });

  // Delete vehicle mutation
  const deleteMutation = useMutation({
  mutationFn: (vehicleId) => joltcab.entities.Vehicle.delete(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  // Set as default mutation
  const setDefaultMutation = useMutation({
    mutationFn: async (vehicleId) => {
      // First, set all vehicles to non-default
      await Promise.all(
        vehicles.map((v) =>
  joltcab.entities.Vehicle.update(v.id, { is_default: false })
        )
      );
      // Then set the selected one as default
  return joltcab.entities.Vehicle.update(vehicleId, { is_default: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      driver_email: user.email,
      name: formData.get("name"),
      plate_no: formData.get("plate_no"),
      model: formData.get("model"),
      make: formData.get("make"),
      color: formData.get("color"),
      passing_year: formData.get("passing_year"),
      service_type_id: formData.get("service_type_id"),
      service_type_name: serviceTypes.find(
        (st) => st.id === formData.get("service_type_id")
      )?.name,
      accessibility: formData.get("accessibility")
        ? formData.get("accessibility").split(",").map((s) => s.trim())
        : [],
    };
    vehicleMutation.mutate(data);
  };

  const handleDelete = (vehicleId) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    deleteMutation.mutate(vehicleId);
  };

  const VehicleDialog = () => (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Vehicle Name *</Label>
              <Input
                name="name"
                placeholder="My Car"
                defaultValue={editingVehicle?.name}
                required
              />
            </div>

            <div>
              <Label>License Plate *</Label>
              <Input
                name="plate_no"
                placeholder="ABC-1234"
                defaultValue={editingVehicle?.plate_no}
                required
              />
            </div>

            <div>
              <Label>Make *</Label>
              <Input
                name="make"
                placeholder="Toyota"
                defaultValue={editingVehicle?.make}
                required
              />
            </div>

            <div>
              <Label>Model *</Label>
              <Input
                name="model"
                placeholder="Camry"
                defaultValue={editingVehicle?.model}
                required
              />
            </div>

            <div>
              <Label>Color *</Label>
              <Input
                name="color"
                placeholder="White"
                defaultValue={editingVehicle?.color}
                required
              />
            </div>

            <div>
              <Label>Year *</Label>
              <Input
                name="passing_year"
                placeholder="2020"
                defaultValue={editingVehicle?.passing_year}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label>Service Type *</Label>
              <Select
                name="service_type_id"
                defaultValue={editingVehicle?.service_type_id}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((st) => (
                    <SelectItem key={st.id} value={st.id}>
                      {st.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>Accessibility Features (comma-separated)</Label>
              <Input
                name="accessibility"
                placeholder="wheelchair, pet-friendly, baby-seat"
                defaultValue={editingVehicle?.accessibility?.join(", ")}
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: wheelchair, pet-friendly, baby-seat
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setEditingVehicle(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#15B46A] hover:bg-[#0F9456]"
              disabled={vehicleMutation.isPending}
            >
              {vehicleMutation.isPending
                ? "Saving..."
                : editingVehicle
                ? "Update Vehicle"
                : "Add Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Vehicles 🚗</h1>
            <p className="text-white/90">Manage your vehicles and documents</p>
          </div>
          <Button
            onClick={() => {
              setEditingVehicle(null);
              setShowAddDialog(true);
            }}
            className="bg-white text-[#15B46A] hover:bg-gray-100"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </motion.div>

      {/* Vehicles Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No vehicles yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first vehicle to start accepting rides
            </p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-[#15B46A] hover:bg-[#0F9456]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Vehicle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <Card className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {vehicle.name}
                        {vehicle.is_default && (
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {vehicle.make} {vehicle.model}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingVehicle(vehicle);
                            setShowAddDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            (window.location.href = createPageUrl(
                              `VehicleDocuments?vehicle_id=${vehicle.id}`
                            ))
                          }
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Documents
                        </DropdownMenuItem>
                        {!vehicle.is_default && (
                          <DropdownMenuItem
                            onClick={() => setDefaultMutation.mutate(vehicle.id)}
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Set as Default
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(vehicle.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Vehicle Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Plate No</p>
                      <p className="font-semibold text-gray-900">
                        {vehicle.plate_no}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Color</p>
                      <p className="font-semibold text-gray-900">
                        {vehicle.color}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Year</p>
                      <p className="font-semibold text-gray-900">
                        {vehicle.passing_year}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-semibold text-gray-900">
                        {vehicle.service_type_name}
                      </p>
                    </div>
                  </div>

                  {/* Accessibility */}
                  {vehicle.accessibility && vehicle.accessibility.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Features</p>
                      <div className="flex flex-wrap gap-2">
                        {vehicle.accessibility.map((feature, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Document Status */}
                  <div className="pt-4 border-t">
                    {vehicle.has_expired_documents ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          Documents expired or missing
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          All documents valid
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        (window.location.href = createPageUrl(
                          `VehicleDocuments?vehicle_id=${vehicle.id}`
                        ))
                      }
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Documents
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingVehicle(vehicle);
                        setShowAddDialog(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Default Badge */}
              {vehicle.is_default && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  DEFAULT
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <VehicleDialog />
    </div>
  );
}