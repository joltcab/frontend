import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Car, Plus, Search, Edit, Trash2, Loader2, CheckCircle, XCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function PartnerVehicles() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
  const userData = await joltcab.auth.me();
      setUser(userData);
      
      if (userData.role !== 'partner') {
        window.location.href = createPageUrl('Home');
        return;
      }

  const profiles = await joltcab.entities.PartnerProfile.filter({
        user_email: userData.email
      });
      
      if (profiles[0]) {
        setProfile(profiles[0]);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  // Get partner's drivers
  const { data: drivers = [] } = useQuery({
    queryKey: ['partnerDrivers', user?.email],
    queryFn: async () => {
  const allDrivers = await joltcab.entities.DriverProfile.filter({});
      return allDrivers.filter(d => d.partner_email === user?.email);
    },
    enabled: !!user,
  });

  // Get all vehicles
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['partnerVehicles', drivers],
    queryFn: async () => {
  const allVehicles = await joltcab.entities.Vehicle.filter({});
      const driverEmails = drivers.map(d => d.user_email);
      return allVehicles.filter(v => driverEmails.includes(v.driver_email));
    },
    enabled: drivers.length > 0,
  });

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plate_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Vehicles</h1>
          <p className="text-gray-600 mt-1">
            Manage all vehicles in your fleet
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Vehicles</p>
                <p className="text-3xl font-bold text-gray-900">{vehicles.length}</p>
              </div>
              <Car className="w-12 h-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Vehicles</p>
                <p className="text-3xl font-bold text-green-600">
                  {vehicles.filter(v => v.is_active).length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inactive Vehicles</p>
                <p className="text-3xl font-bold text-gray-600">
                  {vehicles.filter(v => !v.is_active).length}
                </p>
              </div>
              <XCircle className="w-12 h-12 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search vehicles by name, plate, or model..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No vehicles found</p>
              <p className="text-sm text-gray-400 mt-2">
                Vehicles assigned to your drivers will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle Name</TableHead>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Make/Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Service Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => {
                    const driver = drivers.find(d => d.user_email === vehicle.driver_email);
                    return (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.name}</TableCell>
                        <TableCell className="font-mono">{vehicle.plate_no}</TableCell>
                        <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                        <TableCell>{vehicle.passing_year}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: vehicle.color?.toLowerCase() || '#gray' }}
                            />
                            {vehicle.color}
                          </div>
                        </TableCell>
                        <TableCell>{driver?.user_email || 'Unassigned'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            vehicle.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {vehicle.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                            {vehicle.service_type_name || 'N/A'}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}