import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery } from "@tanstack/react-query";
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
  Users, Copy, Check, Gift, Loader2, TrendingUp, Share2
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";

export default function PartnerReferrals() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      
      if (userData.role !== 'partner') {
        window.location.href = createPageUrl('Home');
        return;
      }

      const profiles = await base44.entities.PartnerProfile.filter({
        user_email: userData.email
      });
      
      if (profiles[0]) {
        setProfile(profiles[0]);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get referred drivers
  const { data: referredDrivers = [] } = useQuery({
    queryKey: ['referredDrivers', user?.email],
    queryFn: async () => {
      const allDrivers = await base44.entities.DriverProfile.filter({});
      // Filter drivers that used this partner's referral code
      return allDrivers.filter(d => d.referred_by === profile?.referral_code);
    },
    enabled: !!profile?.referral_code,
  });

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferralLink = () => {
    const referralLink = `${window.location.origin}${createPageUrl('DriverRegister')}?ref=${profile?.referral_code}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join my fleet on JoltCab',
        text: `Join my fleet as a driver! Use my referral code: ${profile?.referral_code}`,
        url: referralLink
      });
    } else {
      navigator.clipboard.writeText(referralLink);
      alert('Referral link copied to clipboard!');
    }
  };

  if (loading) {
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
      >
        <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
        <p className="text-gray-600 mt-1">
          Invite drivers to join your fleet and grow your business
        </p>
      </motion.div>

      {/* Referral Code Card */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-blue-100 mb-2">Your Referral Code</p>
              <div className="flex items-center gap-4">
                <p className="text-5xl font-bold tracking-wider">
                  {profile?.referral_code || 'N/A'}
                </p>
                <Button
                  onClick={copyReferralCode}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  {copied ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Copy className="w-6 h-6" />
                  )}
                </Button>
              </div>
              <p className="text-blue-100 text-sm mt-4">
                Share this code with drivers to add them to your fleet
              </p>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Gift className="w-10 h-10" />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-blue-400/30">
            <Button
              onClick={shareReferralLink}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Referral Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Referrals</p>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {referredDrivers.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Drivers referred
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Active Referrals</p>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {referredDrivers.filter(d => d.is_online).length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">This Month</p>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {referredDrivers.filter(d => {
                const driverDate = new Date(d.created_date);
                const now = new Date();
                return driverDate.getMonth() === now.getMonth() && 
                       driverDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              New this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Share Your Code</h3>
              <p className="text-sm text-gray-600">
                Share your referral code or link with drivers who want to join
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. They Sign Up</h3>
              <p className="text-sm text-gray-600">
                Driver registers using your code and joins your fleet automatically
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Earn Commission</h3>
              <p className="text-sm text-gray-600">
                Earn commission on all rides completed by your referred drivers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referred Drivers */}
      <Card>
        <CardHeader>
          <CardTitle>Referred Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          {referredDrivers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No referrals yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Start sharing your referral code to grow your fleet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Trips</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referredDrivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">
                        {driver.user_email}
                      </TableCell>
                      <TableCell>{driver.user_email}</TableCell>
                      <TableCell>
                        {format(new Date(driver.created_date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          driver.is_online
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {driver.is_online ? 'Online' : 'Offline'}
                        </span>
                      </TableCell>
                      <TableCell>{driver.total_trips || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}