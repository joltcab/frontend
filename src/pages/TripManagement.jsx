import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Search, Download, MoreVertical, MapPin, FileText, 
  MessageCircle, XCircle, CheckCircle, ChevronLeft, ChevronRight,
  Clock, AlertCircle, Navigation, DollarSign
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";
import { toast } from "@/components/ui/use-toast";

export default function TripManagement() {
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    sortField: 'unique_id',
    sortOrder: '1',
    searchField: 'user_detail.first_name',
    searchValue: '',
    startDate: '',
    endDate: '',
    status: '3', // 0=running, 1=completed, 2=cancelled, 3=all
    payment: '2', // 0=card, 1=cash, 2=both
    page: 1,
    pageSize: 20
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    // Realtime updates every 10 seconds
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    }, 10000);

    return () => clearInterval(interval);
  }, [queryClient]);

  const loadUser = async () => {
    try {
  const userData = await joltcab.auth.me();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  // Fetch trips with filters
  const { data: tripsData, isLoading } = useQuery({
    queryKey: ['trips', filters],
    queryFn: async () => {
      // Get all rides
  const rides = await joltcab.entities.Ride.list();
      
      // Get users and drivers for joining
  const users = await joltcab.entities.User.list();
  const drivers = await joltcab.entities.DriverProfile.list();
  const serviceTypes = await joltcab.entities.ServiceType.list();

      // Merge data
      let trips = rides.map(ride => {
        const passenger = users.find(u => u.email === ride.passenger_email) || {};
        const driverProfile = drivers.find(d => d.user_email === ride.driver_email) || {};
        const driverUser = users.find(u => u.email === ride.driver_email) || {};
        const serviceType = serviceTypes.find(s => s.id === ride.service_type_id) || {};

        // Calculate status flags
        const isCancelled = ride.status === 'cancelled';
        const isCompleted = ride.status === 'completed';
        const isRunning = ride.status === 'in_progress' || ride.status === 'accepted';

        // Provider status mapping
        let providerStatus = 0;
        if (ride.status === 'accepted') providerStatus = 2; // coming
        if (ride.status === 'in_progress') providerStatus = 6; // started
        if (ride.status === 'completed') providerStatus = 9; // completed

        return {
          ...ride,
          unique_id: ride.id.substring(0, 8).toUpperCase(),
          user_detail: {
            unique_id: passenger.id?.substring(0, 8).toUpperCase() || 'N/A',
            first_name: passenger.full_name?.split(' ')[0] || '',
            last_name: passenger.full_name?.split(' ').slice(1).join(' ') || ''
          },
          provider_detail: ride.driver_email ? [{
            unique_id: driverUser.id?.substring(0, 8).toUpperCase() || 'N/A',
            first_name: driverUser.full_name?.split(' ')[0] || '',
            last_name: driverUser.full_name?.split(' ').slice(1).join(' ') || ''
          }] : [],
          type_detail: {
            typename: serviceType.name || 'N/A'
          },
          is_trip_cancelled: isCancelled ? 1 : 0,
          is_trip_completed: isCompleted ? 1 : 0,
          is_provider_status: providerStatus,
          is_provider_accepted: ride.driver_email ? 1 : 0,
          payment_mode: ride.payment_method === 'cash' ? 1 : 0,
          is_paid: isCompleted ? 1 : 0,
          is_pending_payments: 0,
          total: ride.agreed_price || 0,
          created_at: ride.created_date,
          provider_trip_end_time: isCompleted ? new Date() : null,
          is_amount_refund: false,
          payment_transaction: {}
        };
      });

      // Apply status filter
      if (filters.status !== '3') {
        if (filters.status === '1') {
          trips = trips.filter(t => t.is_trip_completed === 1);
        } else if (filters.status === '2') {
          trips = trips.filter(t => t.is_trip_cancelled === 1);
        } else if (filters.status === '0') {
          trips = trips.filter(t => t.is_trip_cancelled === 0 && t.is_trip_completed === 0);
        }
      }

      // Apply payment filter
      if (filters.payment !== '2') {
        trips = trips.filter(t => t.payment_mode === parseInt(filters.payment));
      }

      // Apply search filter
      if (filters.searchValue) {
        trips = trips.filter(t => {
          let value = '';
          if (filters.searchField === 'user_detail.first_name') {
            value = `${t.user_detail.first_name} ${t.user_detail.last_name}`.toLowerCase();
          } else if (filters.searchField === 'user_detail.unique_id') {
            value = t.user_detail.unique_id.toLowerCase();
          } else if (filters.searchField === 'provider_detail.first_name' && t.provider_detail[0]) {
            value = `${t.provider_detail[0].first_name} ${t.provider_detail[0].last_name}`.toLowerCase();
          } else if (filters.searchField === 'provider_detail.unique_id' && t.provider_detail[0]) {
            value = t.provider_detail[0].unique_id.toLowerCase();
          } else if (filters.searchField === 'type_detail.typename') {
            value = t.type_detail.typename.toLowerCase();
          } else {
            value = String(t[filters.searchField] || '').toLowerCase();
          }
          return value.includes(filters.searchValue.toLowerCase());
        });
      }

      // Apply date filter
      if (filters.startDate) {
        trips = trips.filter(t => new Date(t.created_at) >= new Date(filters.startDate));
      }
      if (filters.endDate) {
        trips = trips.filter(t => new Date(t.created_at) <= new Date(filters.endDate));
      }

      // Apply sorting
      trips.sort((a, b) => {
        let aValue, bValue;
        
        if (filters.sortField.includes('.')) {
          const parts = filters.sortField.split('.');
          aValue = a[parts[0]]?.[parts[1]] || '';
          bValue = b[parts[0]]?.[parts[1]] || '';
        } else {
          aValue = a[filters.sortField] || '';
          bValue = b[filters.sortField] || '';
        }

        if (filters.sortOrder === '1') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Pagination
      const total = trips.length;
      const totalPages = Math.ceil(total / filters.pageSize);
      const start = (filters.page - 1) * filters.pageSize;
      const end = start + filters.pageSize;
      const paginatedTrips = trips.slice(start, end);

      return {
        trips: paginatedTrips,
        total,
        totalPages,
        currentPage: filters.page
      };
    },
    enabled: !!user,
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  // Complete trip
  const completeTripMutation = useMutation({
    mutationFn: async ({ tripId }) => {
  await joltcab.entities.Ride.update(tripId, {
        status: 'completed'
      });

      // Process payment
  await joltcab.functions.invoke('processPayment', {
        ride_id: tripId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast({ title: "Trip completed successfully" });
    },
  });

  // Cancel trip
  const cancelTripMutation = useMutation({
    mutationFn: async ({ tripId }) => {
  const { data } = await joltcab.functions.invoke('cancelRide', {
        ride_id: tripId,
        cancelled_by: 'admin',
        reason: 'cancelled_by_admin'
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast({ title: "Trip cancelled successfully" });
    },
  });

  const exportToExcel = () => {
    if (!tripsData) return;

    const headers = ['ID', 'User ID', 'User Name', 'Provider ID', 'Provider Name', 'Service Type', 'Created Date', 'Completed Date', 'Status', 'Amount', 'Payment', 'Payment Status'];
    const rows = tripsData.trips.map(t => [
      t.unique_id,
      t.user_detail.unique_id,
      `${t.user_detail.first_name} ${t.user_detail.last_name}`,
      t.provider_detail[0]?.unique_id || '',
      t.provider_detail[0] ? `${t.provider_detail[0].first_name} ${t.provider_detail[0].last_name}` : '',
      t.type_detail.typename,
      format(new Date(t.created_at), 'yyyy-MM-dd HH:mm'),
      t.provider_trip_end_time ? format(new Date(t.provider_trip_end_time), 'yyyy-MM-dd HH:mm') : '',
      getStatusText(t),
      t.total,
      t.payment_mode === 1 ? 'Cash' : 'Card',
      t.is_paid === 1 ? 'Paid' : 'Not Paid'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trips_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusText = (trip) => {
    if (trip.is_trip_cancelled === 1) {
      return 'Cancelled';
    }
    if (trip.is_provider_status === 2) return 'Coming';
    if (trip.is_provider_status === 4) return 'Arrived';
    if (trip.is_provider_status === 6) return 'Started';
    if (trip.is_provider_status === 9) return 'Completed';
    if (trip.is_provider_accepted === 1) return 'Accepted';
    return 'Waiting';
  };

  const getStatusBadge = (trip) => {
    if (trip.is_trip_cancelled === 1) {
      return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
    }
    if (trip.is_provider_status === 2) {
      return <Badge className="bg-yellow-500"><Navigation className="w-3 h-3 mr-1" />Coming</Badge>;
    }
    if (trip.is_provider_status === 4) {
      return <Badge className="bg-blue-500"><MapPin className="w-3 h-3 mr-1" />Arrived</Badge>;
    }
    if (trip.is_provider_status === 6) {
      return <Badge className="bg-purple-500"><Clock className="w-3 h-3 mr-1" />Started</Badge>;
    }
    if (trip.is_provider_status === 9) {
      return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
    }
    if (trip.is_provider_accepted === 1) {
      return <Badge className="bg-blue-400">Accepted</Badge>;
    }
    return <Badge className="bg-gray-400"><Clock className="w-3 h-3 mr-1" />Waiting</Badge>;
  };

  if (isLoading || !tripsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Sort */}
            <div className="space-y-2">
              <Label>Sort By</Label>
              <div className="flex gap-2">
                <Select
                  value={filters.sortField}
                  onValueChange={(value) => setFilters({ ...filters, sortField: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unique_id">ID</SelectItem>
                    <SelectItem value="created_at">Created Date</SelectItem>
                    <SelectItem value="user_detail.unique_id">User ID</SelectItem>
                    <SelectItem value="user_detail.first_name">User Name</SelectItem>
                    <SelectItem value="provider_detail.unique_id">Provider ID</SelectItem>
                    <SelectItem value="provider_detail.first_name">Provider Name</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.sortOrder}
                  onValueChange={(value) => setFilters({ ...filters, sortOrder: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ascending</SelectItem>
                    <SelectItem value="-1">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="flex gap-2">
                <Select
                  value={filters.searchField}
                  onValueChange={(value) => setFilters({ ...filters, searchField: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unique_id">ID</SelectItem>
                    <SelectItem value="user_detail.unique_id">User ID</SelectItem>
                    <SelectItem value="user_detail.first_name">User Name</SelectItem>
                    <SelectItem value="provider_detail.unique_id">Provider ID</SelectItem>
                    <SelectItem value="provider_detail.first_name">Provider Name</SelectItem>
                    <SelectItem value="type_detail.typename">Service Type</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search..."
                    value={filters.searchValue}
                    onChange={(e) => setFilters({ ...filters, searchValue: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date Filter & Status */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">All</SelectItem>
                  <SelectItem value="1">Completed</SelectItem>
                  <SelectItem value="2">Cancelled</SelectItem>
                  <SelectItem value="0">Running</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment</Label>
              <Select
                value={filters.payment}
                onValueChange={(value) => setFilters({ ...filters, payment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Both</SelectItem>
                  <SelectItem value="1">Cash</SelectItem>
                  <SelectItem value="0">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pagination & Export */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                disabled={filters.page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-sm text-gray-600">
                Page {tripsData.currentPage} of {tripsData.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, page: Math.min(tripsData.totalPages, filters.page + 1) })}
                disabled={filters.page === tripsData.totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <Button onClick={exportToExcel} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trips Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Provider ID</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Completed Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tripsData.trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell className="font-mono text-xs">{trip.unique_id}</TableCell>
                    <TableCell className="font-mono text-xs">{trip.user_detail.unique_id}</TableCell>
                    <TableCell>{trip.user_detail.first_name} {trip.user_detail.last_name}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {trip.provider_detail[0]?.unique_id || '-'}
                    </TableCell>
                    <TableCell>
                      {trip.provider_detail[0] 
                        ? `${trip.provider_detail[0].first_name} ${trip.provider_detail[0].last_name}`
                        : '-'}
                    </TableCell>
                    <TableCell>{trip.type_detail.typename}</TableCell>
                    <TableCell className="text-xs">
                      {format(new Date(trip.created_at), 'dd MMM yy')}<br />
                      {format(new Date(trip.created_at), 'hh:mm a')}
                    </TableCell>
                    <TableCell className="text-xs">
                      {trip.provider_trip_end_time && (
                        <>
                          {format(new Date(trip.provider_trip_end_time), 'dd MMM yy')}<br />
                          {format(new Date(trip.provider_trip_end_time), 'hh:mm a')}
                        </>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(trip)}</TableCell>
                    <TableCell>${trip.total}</TableCell>
                    <TableCell>
                      <Badge className={trip.payment_mode === 1 ? 'bg-gray-500' : 'bg-blue-500'}>
                        {trip.payment_mode === 1 ? 'Cash' : 'Card'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {trip.is_pending_payments === 1 ? (
                        <Badge className="bg-yellow-500">Pending</Badge>
                      ) : trip.is_paid === 1 ? (
                        <Badge className="bg-green-500">Paid</Badge>
                      ) : (
                        <Badge className="bg-red-500">Not Paid</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => window.location.href = createPageUrl(`TrackRide?id=${trip.id}`)}>
                            <MapPin className="w-4 h-4 mr-2" />
                            View Map
                          </DropdownMenuItem>
                          {(trip.is_provider_status === 9 || trip.is_trip_cancelled === 1) && (
                            <DropdownMenuItem onClick={() => window.location.href = createPageUrl(`RideDetail?id=${trip.id}`)}>
                              <FileText className="w-4 h-4 mr-2" />
                              View Invoice
                            </DropdownMenuItem>
                          )}
                          {trip.is_provider_accepted === 1 && (
                            <DropdownMenuItem onClick={() => window.location.href = createPageUrl(`ChatHistory?id=${trip.id}`)}>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Chat History
                            </DropdownMenuItem>
                          )}
                          {trip.is_trip_cancelled === 0 && trip.is_trip_completed === 0 && (
                            <DropdownMenuItem 
                              onClick={() => cancelTripMutation.mutate({ tripId: trip.id })}
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel Trip
                            </DropdownMenuItem>
                          )}
                          {trip.is_trip_cancelled === 0 && trip.is_trip_completed === 0 && trip.is_provider_status === 6 && (
                            <DropdownMenuItem 
                              onClick={() => completeTripMutation.mutate({ tripId: trip.id })}
                              className="text-green-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Complete Trip
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}