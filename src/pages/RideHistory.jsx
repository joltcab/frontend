import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/components/i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  X,
  Download,
  Filter,
  ChevronDown,
  Eye,
  XCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  Search,
  TrendingUp,
  Receipt,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";

export default function RideHistory() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [cancellingRide, setCancellingRide] = useState(null);

  // Filtros
  const [sortField, setSortField] = useState("created_date");
  const [sortOrder, setSortOrder] = useState("-1"); // -1 = DESC, 1 = ASC
  const [searchField, setSearchField] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Estado de filtros aplicados
  const [appliedFilters, setAppliedFilters] = useState({
    sortField: "created_date",
    sortOrder: "-1",
    searchField: "id",
    searchValue: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user");
    }
  };

  // Determinar si es conductor o pasajero
  const isDriver = user?.role === "driver";

  // Fetch rides con auto-refresh cada 5 segundos
  const { data: rides = [], isLoading } = useQuery({
    queryKey: ["rides", user?.email, user?.role, appliedFilters],
    queryFn: async () => {
      const filterField = isDriver ? "driver_email" : "passenger_email";
      let allRides = await base44.entities.Ride.filter(
        { [filterField]: user.email },
        `-${appliedFilters.sortField}`,
        1000
      );

      // Aplicar filtros
      if (appliedFilters.searchValue) {
        allRides = allRides.filter((ride) => {
          if (appliedFilters.searchField === "id") {
            return ride.id.toLowerCase().includes(appliedFilters.searchValue.toLowerCase());
          } else if (appliedFilters.searchField === "driver") {
            return ride.driver_email?.toLowerCase().includes(appliedFilters.searchValue.toLowerCase());
          } else if (appliedFilters.searchField === "passenger") {
            return ride.passenger_email?.toLowerCase().includes(appliedFilters.searchValue.toLowerCase());
          }
          return true;
        });
      }

      // Filtro por fechas
      if (appliedFilters.startDate) {
        allRides = allRides.filter((ride) => {
          const rideDate = new Date(ride.created_date);
          return rideDate >= new Date(appliedFilters.startDate);
        });
      }

      if (appliedFilters.endDate) {
        allRides = allRides.filter((ride) => {
          const rideDate = new Date(ride.created_date);
          const endDateTime = new Date(appliedFilters.endDate);
          endDateTime.setHours(23, 59, 59, 999);
          return rideDate <= endDateTime;
        });
      }

      // Sort
      if (appliedFilters.sortOrder === "1") {
        allRides.reverse();
      }

      return allRides;
    },
    enabled: !!user,
    refetchInterval: 5000, // Auto-refresh cada 5 segundos
  });

  // Calcular stats para conductores
  const driverStats = React.useMemo(() => {
    if (!isDriver || !rides.length) return null;

    const completed = rides.filter(r => r.status === 'completed');
    const totalEarnings = completed.reduce((sum, r) => sum + (r.agreed_price || 0), 0);
    const driverEarnings = totalEarnings * 0.85; // 85% para el conductor
    const platformFee = totalEarnings * 0.15; // 15% para la plataforma

    return {
      totalRides: rides.length,
      completedRides: completed.length,
      totalEarnings: totalEarnings.toFixed(2),
      driverEarnings: driverEarnings.toFixed(2),
      platformFee: platformFee.toFixed(2),
      avgPerRide: completed.length > 0 ? (driverEarnings / completed.length).toFixed(2) : 0,
    };
  }, [rides, isDriver]);

  const applyFilters = () => {
    setAppliedFilters({
      sortField,
      sortOrder,
      searchField,
      searchValue,
      startDate,
      endDate,
    });
  };

  const resetFilters = () => {
    setSortField("created_date");
    setSortOrder("-1");
    setSearchField("id");
    setSearchValue("");
    setStartDate("");
    setEndDate("");
    setAppliedFilters({
      sortField: "created_date",
      sortOrder: "-1",
      searchField: "id",
      searchValue: "",
      startDate: "",
      endDate: "",
    });
  };

  const exportToExcel = () => {
    const headers = isDriver 
      ? ["ID", "Passenger", "Date", "Status", "Pickup", "Dropoff", "Total Price", "Your Earning", "Platform Fee", "Payment"]
      : ["ID", "Driver", "Date", "Status", "Pickup", "Dropoff", "Price", "Payment"];
    
    const csvData = rides.map((ride) => {
      const baseData = [
        ride.id.slice(0, 8),
        isDriver ? ride.passenger_email : (ride.driver_email || "No Driver"),
        format(new Date(ride.created_date), "dd/MM/yyyy HH:mm"),
        ride.status,
        ride.pickup_location,
        ride.dropoff_location,
      ];

      if (isDriver && ride.status === 'completed') {
        const total = ride.agreed_price || 0;
        const earning = total * 0.85;
        const fee = total * 0.15;
        return [...baseData, `$${total}`, `$${earning.toFixed(2)}`, `$${fee.toFixed(2)}`, ride.payment_method || "N/A"];
      } else {
        return [...baseData, `$${ride.agreed_price || 0}`, ride.payment_method || "N/A"];
      }
    });

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ride_history_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    const badges = {
      requested: { bg: "bg-blue-100", text: "text-blue-800", icon: Clock },
      negotiating: { bg: "bg-yellow-100", text: "text-yellow-800", icon: AlertCircle },
      accepted: { bg: "bg-purple-100", text: "text-purple-800", icon: CheckCircle },
      in_progress: { bg: "bg-indigo-100", text: "text-indigo-800", icon: MapPin },
      completed: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
      cancelled: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
    };

    const badge = badges[status] || badges.requested;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {t(`status.${status}`) || status}
      </span>
    );
  };

  const handleCancelRide = async (rideId) => {
    if (!confirm("Are you sure you want to cancel this ride?")) return;

    setCancellingRide(rideId);
    try {
      const { data } = await base44.functions.invoke("cancelRide", {
        ride_id: rideId,
        reason: "changed_mind",
        reason_text: "User cancelled via dashboard",
      });

      if (data.success) {
        alert("Ride cancelled successfully");
      }
    } catch (error) {
      alert("Error cancelling ride: " + error.message);
    } finally {
      setCancellingRide(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] rounded-3xl p-8 text-white shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2">
          {isDriver ? "My Trips" : "My Rides"}
        </h1>
        <p className="text-white/90">
          {isDriver 
            ? "View all your trips and earnings history" 
            : "View all your ride bookings and history"}
        </p>
      </motion.div>

      {/* Driver Stats - Solo para conductores */}
      {isDriver && driverStats && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{driverStats.completedRides}</p>
                  <p className="text-sm text-gray-600">Completed Trips</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">${driverStats.driverEarnings}</p>
                  <p className="text-sm text-gray-600">Your Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">${driverStats.avgPerRide}</p>
                  <p className="text-sm text-gray-600">Avg per Trip</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#15B46A]" />
            <h3 className="font-semibold text-lg">Filters</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_date">Date</SelectItem>
                  <SelectItem value="id">ID</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  {isDriver && <SelectItem value="agreed_price">Price</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">Newest First</SelectItem>
                  <SelectItem value="1">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search By</label>
              <Select value={searchField} onValueChange={setSearchField}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Ride ID</SelectItem>
                  {isDriver ? (
                    <SelectItem value="passenger">Passenger</SelectItem>
                  ) : (
                    <SelectItem value="driver">Driver</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Search Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2 md:col-span-2">
              <Button onClick={applyFilters} className="flex-1 bg-[#15B46A] hover:bg-[#0F9456]">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
              <Button onClick={resetFilters} variant="outline" className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={exportToExcel} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rides List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : rides.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No rides found</p>
              <p className="text-sm text-gray-500">
                {isDriver ? "Start accepting rides to see them here" : "Book your first ride to get started"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            {rides.map((ride, index) => (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid lg:grid-cols-12 gap-4 items-center">
                      {/* ID + Status */}
                      <div className="lg:col-span-3">
                        <p className="text-xs text-gray-500 mb-1">Ride ID</p>
                        <p className="font-mono text-sm font-semibold text-gray-900 mb-2">
                          {ride.id.slice(0, 8)}
                        </p>
                        {getStatusBadge(ride.status)}
                      </div>

                      {/* User Info */}
                      <div className="lg:col-span-2">
                        <p className="text-xs text-gray-500 mb-1">
                          {isDriver ? "Passenger" : "Driver"}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {isDriver ? ride.passenger_email : (ride.driver_email || "No Driver")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(ride.created_date), "MMM d, yyyy • HH:mm")}
                        </p>
                      </div>

                      {/* Route */}
                      <div className="lg:col-span-4">
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-[#15B46A]"></div>
                            <div className="w-0.5 h-8 bg-gray-300"></div>
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              {ride.pickup_location}
                            </p>
                            <p className="text-sm text-gray-600">
                              {ride.dropoff_location}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price + Earnings (para conductores) */}
                      <div className="lg:col-span-2">
                        {isDriver && ride.status === 'completed' ? (
                          <>
                            <p className="text-xs text-gray-500 mb-1">Your Earning</p>
                            <p className="text-2xl font-bold text-[#15B46A]">
                              ${((ride.agreed_price || 0) * 0.85).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Total: ${ride.agreed_price || 0}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-gray-500 mb-1">Price</p>
                            <p className="text-2xl font-bold text-[#15B46A]">
                              ${ride.agreed_price || 0}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {ride.payment_method || "N/A"}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-1 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <ChevronDown className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => window.location.href = createPageUrl(`RideDetail?ride_id=${ride.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>

                            {ride.status === "completed" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => window.location.href = createPageUrl(`TrackRide?ride_id=${ride.id}`)}
                                >
                                  <MapPin className="w-4 h-4 mr-2" />
                                  View Map
                                </DropdownMenuItem>
                                
                                {isDriver && (
                                  <DropdownMenuItem
                                    onClick={async () => {
                                      try {
                                        const { data } = await base44.functions.invoke("exportRideInvoice", { ride_id: ride.id });
                                        const blob = new Blob([data], { type: "application/pdf" });
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = `invoice_${ride.id.slice(0, 8)}.pdf`;
                                        a.click();
                                      } catch (error) {
                                        alert("Error generating invoice: " + error.message);
                                      }
                                    }}
                                  >
                                    <Receipt className="w-4 h-4 mr-2" />
                                    Download Invoice
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}

                            {(ride.status === "requested" || ride.status === "negotiating" || ride.status === "accepted") && (
                              <DropdownMenuItem
                                onClick={() => handleCancelRide(ride.id)}
                                disabled={cancellingRide === ride.id}
                                className="text-red-600"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                {cancellingRide === ride.id ? "Cancelling..." : "Cancel Ride"}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}