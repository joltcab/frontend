import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, TrendingUp, Calendar, Download, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths } from "date-fns";

export default function DriverEarnings() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState("created_date");
  const [sortOrder, setSortOrder] = useState("-1");

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

  // Fetch earnings data
  const { data: earningsData = [], isLoading } = useQuery({
    queryKey: ["driverEarnings", user?.email, activeTab, startDate, endDate],
    queryFn: async () => {
  let allEarnings = await joltcab.entities.DriverEarning.filter(
        { driver_email: user.email },
        `-${sortField}`,
        1000
      );

      // Filter by date if provided
      if (startDate) {
        allEarnings = allEarnings.filter((e) => {
          const earningDate = new Date(e.date);
          return earningDate >= new Date(startDate);
        });
      }

      if (endDate) {
        allEarnings = allEarnings.filter((e) => {
          const earningDate = new Date(e.date);
          return earningDate <= new Date(endDate);
        });
      }

      return allEarnings;
    },
    enabled: !!user,
  });

  // Calculate summary stats
  const summary = earningsData.reduce(
    (acc, earning) => ({
      totalEarnings: acc.totalEarnings + (earning.total_earnings || 0),
      grossAmount: acc.grossAmount + (earning.gross_amount || 0),
      commission: acc.commission + (earning.commission_amount || 0),
      tips: acc.tips + (earning.tips || 0),
      bonus: acc.bonus + (earning.bonus || 0),
      trips: acc.trips + 1,
    }),
    { totalEarnings: 0, grossAmount: 0, commission: 0, tips: 0, bonus: 0, trips: 0 }
  );

  const exportToExcel = () => {
    const headers = ["Date", "Ride ID", "Gross", "Commission", "Net", "Tips", "Bonus", "Total", "Status"];
    const csvData = earningsData.map((e) => [
      format(new Date(e.date), "dd/MM/yyyy"),
      e.ride_id?.slice(0, 8) || "N/A",
      `$${e.gross_amount.toFixed(2)}`,
      `$${e.commission_amount.toFixed(2)}`,
      `$${e.net_amount.toFixed(2)}`,
      `$${e.tips.toFixed(2)}`,
      `$${e.bonus.toFixed(2)}`,
      `$${e.total_earnings.toFixed(2)}`,
      e.payment_status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `earnings_${activeTab}_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const setQuickDateRange = (range) => {
    const today = new Date();
    switch (range) {
      case "today":
        setStartDate(format(startOfDay(today), "yyyy-MM-dd"));
        setEndDate(format(endOfDay(today), "yyyy-MM-dd"));
        break;
      case "yesterday":
        setStartDate(format(startOfDay(subDays(today, 1)), "yyyy-MM-dd"));
        setEndDate(format(endOfDay(subDays(today, 1)), "yyyy-MM-dd"));
        break;
      case "thisWeek":
        setStartDate(format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd"));
        setEndDate(format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd"));
        break;
      case "lastWeek":
        setStartDate(format(startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }), "yyyy-MM-dd"));
        setEndDate(format(endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }), "yyyy-MM-dd"));
        break;
      case "thisMonth":
        setStartDate(format(startOfMonth(today), "yyyy-MM-dd"));
        setEndDate(format(endOfMonth(today), "yyyy-MM-dd"));
        break;
      case "lastMonth":
        setStartDate(format(startOfMonth(subMonths(today, 1)), "yyyy-MM-dd"));
        setEndDate(format(endOfMonth(subMonths(today, 1)), "yyyy-MM-dd"));
        break;
      default:
        setStartDate("");
        setEndDate("");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] rounded-3xl p-8 text-white shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2">My Earnings</h1>
        <p className="text-white/90">Track your income and performance</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-[#15B46A]">
                  ${summary.totalEarnings.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#15B46A]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trips</p>
                <p className="text-3xl font-bold text-gray-900">{summary.trips}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tips Received</p>
                <p className="text-3xl font-bold text-yellow-600">
                  ${summary.tips.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bonuses</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${summary.bonus.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-4">
            {/* Quick Date Buttons */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Filters</label>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setQuickDateRange("today")}>
                  Today
                </Button>
                <Button size="sm" variant="outline" onClick={() => setQuickDateRange("yesterday")}>
                  Yesterday
                </Button>
                <Button size="sm" variant="outline" onClick={() => setQuickDateRange("thisWeek")}>
                  This Week
                </Button>
                <Button size="sm" variant="outline" onClick={() => setQuickDateRange("thisMonth")}>
                  This Month
                </Button>
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

            {/* Export Button */}
            <Button onClick={exportToExcel} className="bg-[#15B46A] hover:bg-[#0F9456]">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Ride ID</th>
                  <th className="text-right p-4 font-semibold text-gray-700">Gross</th>
                  <th className="text-right p-4 font-semibold text-gray-700">Commission</th>
                  <th className="text-right p-4 font-semibold text-gray-700">Net</th>
                  <th className="text-right p-4 font-semibold text-gray-700">Tips</th>
                  <th className="text-right p-4 font-semibold text-gray-700">Bonus</th>
                  <th className="text-right p-4 font-semibold text-gray-700">Total</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {earningsData.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-12 text-gray-500">
                      No earnings data found
                    </td>
                  </tr>
                ) : (
                  earningsData.map((earning) => (
                    <tr key={earning.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{format(new Date(earning.date), "dd/MM/yyyy")}</td>
                      <td className="p-4 text-sm text-gray-600">
                        {earning.ride_id?.slice(0, 8) || "N/A"}
                      </td>
                      <td className="p-4 text-right">${earning.gross_amount.toFixed(2)}</td>
                      <td className="p-4 text-right text-red-600">
                        -${earning.commission_amount.toFixed(2)}
                      </td>
                      <td className="p-4 text-right font-semibold">
                        ${earning.net_amount.toFixed(2)}
                      </td>
                      <td className="p-4 text-right text-green-600">
                        +${earning.tips.toFixed(2)}
                      </td>
                      <td className="p-4 text-right text-purple-600">
                        +${earning.bonus.toFixed(2)}
                      </td>
                      <td className="p-4 text-right font-bold text-[#15B46A]">
                        ${earning.total_earnings.toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            earning.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {earning.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}