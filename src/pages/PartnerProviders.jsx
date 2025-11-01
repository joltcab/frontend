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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users, Plus, Search, MoreVertical, Edit, Trash2,
  Car, DollarSign, Eye, Loader2, UserCheck, UserX
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function PartnerProviders() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDriver, setShowAddDriver] = useState(false);
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
  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ['partnerDrivers', user?.email],
    queryFn: async () => {
  const allDrivers = await joltcab.entities.DriverProfile.filter({});
      return allDrivers.filter(d => d.partner_email === user?.email);
    },
    enabled: !!user,
  });

  // Get rides per driver
  const { data: ridesPerDriver = {} } = useQuery({
    queryKey: ['driverRides', drivers],
    queryFn: async () => {
  const allRides = await joltcab.entities.Ride.filter({});
      const ridesMap = {};
      
      drivers.forEach(driver => {
        const driverRides = allRides.filter(r => 
          r.driver_email === driver.user_email && r.status === 'completed'
        );
        ridesMap[driver.user_email] = {
          count: driverRides.length,
          revenue: driverRides.reduce((sum, r) => sum + (r.agreed_price || 0), 0)
        };
      });
      
      return ridesMap;
    },
    enabled: drivers.length > 0,
  });

  // Remove driver mutation
  const removeDriverMutation = useMutation({
    mutationFn: async (driverEmail) => {
      // Update driver profile to remove partner association
  const driverProfiles = await joltcab.entities.DriverProfile.filter({
        user_email: driverEmail
      });
      
      if (driverProfiles[0]) {
  await joltcab.entities.DriverProfile.update(driverProfiles[0].id, {
          partner_email: null
        });
      }

      // Update partner's total providers
      if (profile) {
  await joltcab.entities.PartnerProfile.update(profile.id, {
          total_providers: Math.max(0, (profile.total_providers || 0) - 1)
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['partnerDrivers']);
      alert('Driver removed from your fleet successfully');
    },
    onError: (error) => {
      alert('Failed to remove driver: ' + error.message);
    }
  });

  const handleRemoveDriver = (driverEmail) => {
    if (confirm('Are you sure you want to remove this driver from your fleet?')) {
      removeDriverMutation.mutate(driverEmail);
    }
  };

  // Filter drivers
  const filteredDrivers = drivers.filter(driver =>
    driver.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${driver.user_email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
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
          <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
          <p className="text-gray-600 mt-1">
            Manage drivers in your fleet
          </p>
        </div>
        <Button
          onClick={() => setShowAddDriver(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Driver
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Drivers</p>
                <p className="text-3xl font-bold text-gray-900">{drivers.length}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Now</p>
                <p className="text-3xl font-bold text-green-600">
                  {drivers.filter(d => d.is_online).length}
                </p>
              </div>
              <UserCheck className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Offline</p>
                <p className="text-3xl font-bold text-gray-600">
                  {drivers.filter(d => !d.is_online).length}
                </p>
              </div>
              <UserX className="w-12 h-12 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search drivers by email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No drivers found</p>
              <p className="text-sm text-gray-400 mt-2">
                Add drivers to your fleet to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Rides</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.map((driver) => {
                    const driverStats = ridesPerDriver[driver.user_email] || { count: 0, revenue: 0 };
                    return (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">
                          {driver.user_email}
                        </TableCell>
                        <TableCell>{driver.user_email}</TableCell>
                        <TableCell>{driver.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            driver.is_online
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {driver.is_online ? 'Online' : 'Offline'}
                          </span>
                        </TableCell>
                        <TableCell>{driverStats.count}</TableCell>
                        <TableCell>${driverStats.revenue.toFixed(2)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Car className="w-4 h-4 mr-2" />
                                Assign Vehicle
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <DollarSign className="w-4 h-4 mr-2" />
                                View Earnings
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRemoveDriver(driver.user_email)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove from Fleet
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Add Driver Dialog */}
      <Dialog open={showAddDriver} onOpenChange={setShowAddDriver}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Driver to Fleet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              To add a driver to your fleet, the driver must first register independently.
              Once registered, you can assign them to your fleet using their email address.
            </p>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900 font-medium">
                💡 Share your partner referral code with drivers to streamline the process
              </p>
              {profile.referral_code && (
                <p className="text-lg font-mono font-bold text-blue-600 mt-2">
                  {profile.referral_code}
                </p>
              )}
            </div>
            <Button
              onClick={() => setShowAddDriver(false)}
              className="w-full"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}