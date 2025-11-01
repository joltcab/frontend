import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import joltcab from "@/lib/joltcab-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Search, CheckCircle, XCircle, Clock, Eye } from "lucide-react";

export default function ServiceProviders() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: drivers = [] } = useQuery({
    queryKey: ['allDrivers'],
  queryFn: () => joltcab.entities.DriverProfile.list('-created_date', 200),
  });

  const updateDriverMutation = useMutation({
  mutationFn: ({ driverId, data }) => joltcab.entities.DriverProfile.update(driverId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDrivers'] });
    },
  });

  const onlineDrivers = drivers.filter(d => d.is_online);
  const approvedDrivers = drivers.filter(d => d.background_check_status === 'approved');
  const unapprovedDrivers = drivers.filter(d => d.background_check_status === 'pending');

  const DriversList = ({ drivers, showActions = true }) => (
    <div className="space-y-3">
      {drivers.map((driver) => (
        <div
          key={driver.id}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {driver.user_email?.charAt(0).toUpperCase() || "D"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{driver.user_email}</p>
              <p className="text-sm text-gray-600">
                {driver.vehicle_make} {driver.vehicle_model} - {driver.vehicle_plate}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">⭐ {driver.rating || 5}/5</span>
                <span className="text-xs text-gray-500">• {driver.total_trips || 0} trips</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {driver.is_online && (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online
              </Badge>
            )}
            
            <Badge className={
              driver.background_check_status === 'approved' ? 'bg-green-100 text-green-800' :
              driver.background_check_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }>
              {driver.background_check_status}
            </Badge>

            {showActions && driver.background_check_status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => updateDriverMutation.mutate({
                    driverId: driver.id,
                    data: { background_check_status: 'approved' }
                  })}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => updateDriverMutation.mutate({
                    driverId: driver.id,
                    data: { background_check_status: 'rejected' }
                  })}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Drivers</p>
                <p className="text-3xl font-bold text-gray-900">{drivers.length}</p>
              </div>
              <Car className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online Now</p>
                <p className="text-3xl font-bold text-green-600">{onlineDrivers.length}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
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
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{unapprovedDrivers.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl shadow-md">
          <TabsTrigger value="all">
            All Providers ({drivers.length})
          </TabsTrigger>
          <TabsTrigger value="online">
            Online ({onlineDrivers.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedDrivers.length})
          </TabsTrigger>
          <TabsTrigger value="unapproved">
            Unapproved ({unapprovedDrivers.length})
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Service Providers</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search drivers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="all">
              <DriversList drivers={drivers} />
            </TabsContent>

            <TabsContent value="online">
              <DriversList drivers={onlineDrivers} showActions={false} />
            </TabsContent>

            <TabsContent value="approved">
              <DriversList drivers={approvedDrivers} showActions={false} />
            </TabsContent>

            <TabsContent value="unapproved">
              <DriversList drivers={unapprovedDrivers} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}