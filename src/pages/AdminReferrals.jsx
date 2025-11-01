import React, { useState } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Users, Gift, TrendingUp, DollarSign, Search,
  CheckCircle, UserPlus, Award, Clock
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminReferrals() {
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  // Fetch users with referral data
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users-referrals'],
    queryFn: () => joltcab.entities.User.list()
  });

  // Update mutation for referral bonuses
  const updateMutation = useMutation({
    mutationFn: async ({ userId, data }) => {
      return await joltcab.entities.User.update(userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users-referrals']);
      alert('User updated successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  // Filter users
  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.referral_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalReferrals = users.reduce((sum, user) => sum + (user.successful_referrals || 0), 0);
  const totalBonusGiven = users.reduce((sum, user) => sum + (user.referral_earnings || 0), 0);
  const activeReferrers = users.filter(user => (user.successful_referrals || 0) > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
        <p className="text-gray-600 mt-1">Track and manage user referrals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{totalReferrals}</p>
              </div>
              <UserPlus className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Referrers</p>
                <p className="text-2xl font-bold text-gray-900">{activeReferrers}</p>
              </div>
              <Users className="w-10 h-10 text-[#15B46A]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bonus Given</p>
                <p className="text-2xl font-bold text-gray-900">${totalBonusGiven.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg per Referrer</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeReferrers > 0 ? (totalReferrals / activeReferrers).toFixed(1) : '0'}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name, email, or referral code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#15B46A]" />
            Referral Activity ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading referral data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Referral Code</TableHead>
                    <TableHead>Successful Referrals</TableHead>
                    <TableHead>Pending Referrals</TableHead>
                    <TableHead>Earnings from Referrals</TableHead>
                    <TableHead>Referred By</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {user.referral_code || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-semibold">{user.successful_referrals || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span>{user.pending_referrals || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#15B46A] text-white">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {(user.referral_earnings || 0).toFixed(2)}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateMutation.mutate({
                              userId: user.id,
                              data: {
                                referral_earnings: (user.referral_earnings || 0) + 10
                              }
                            })}
                            disabled={updateMutation.isLoading}
                          >
                            +$10
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.referred_by ? (
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-purple-500" />
                            <span className="text-sm text-gray-600">
                              {users.find(u => u.referral_code === user.referred_by)?.full_name || user.referred_by}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {(user.successful_referrals || 0) > 0 ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">No Referrals</Badge>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No users found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Referrers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Top Referrers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users
              .filter(u => (u.successful_referrals || 0) > 0)
              .sort((a, b) => (b.successful_referrals || 0) - (a.successful_referrals || 0))
              .slice(0, 10)
              .map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-400 text-white' :
                      index === 1 ? 'bg-gray-300 text-white' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{user.full_name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#15B46A]">{user.successful_referrals} referrals</div>
                    <div className="text-sm text-gray-500">${(user.referral_earnings || 0).toFixed(2)} earned</div>
                  </div>
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}