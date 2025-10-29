import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Globe, Camera, Save, ArrowLeft, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    city: "",
    country: "",
    profile_image: "",
  });

  // NEW: Change password state
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setFormData({
        full_name: userData.full_name || "",
        phone: userData.phone || "",
        city: userData.city || "",
        country: userData.country || "",
        profile_image: userData.profile_image || "",
      });
      setImagePreview(userData.profile_image || "");
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload image
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setFormData({ ...formData, profile_image: file_url });
      } catch (error) {
        console.error("Error uploading image:", error);
        setImageFile(null);
        setImagePreview(user?.profile_image || "");
      }
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.auth.updateMe(data);
    },
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      queryClient.invalidateQueries();
      loadUser();
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  // NEW: Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.functions.invoke('changePassword', data);
    },
    onSuccess: (response) => {
      if (response.data.success) {
        setShowPasswordSuccess(true);
        setPasswordData({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
        setTimeout(() => setShowPasswordSuccess(false), 3000);
      } else {
        setPasswordError(response.data.error || "Failed to change password");
      }
    },
    onError: (error) => {
      console.error("Error changing password:", error);
      setPasswordError(error.message || "An error occurred while changing password");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  // NEW: handlePasswordSubmit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!user?.email) {
      setPasswordError("User email not found.");
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwordData.new_password.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    changePasswordMutation.mutate({
      user_email: user.email,
      old_password: passwordData.old_password,
      new_password: passwordData.new_password,
    });
  };

  const getDashboardUrl = () => {
    const dashboards = {
      user: "UserDashboard",
      driver: "DriverDashboard",
      corporate: "CorporateDashboard",
      hotel: "HotelDashboard",
      dispatcher: "DispatcherDashboard",
      admin: "AdminPanel"
    };
    return createPageUrl(dashboards[user?.role] || "UserDashboard");
  };

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={() => window.location.href = getDashboardUrl()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-white/90">Manage your account information</p>
      </motion.div>

      {/* Success Toast */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
        >
          ✓ Profile saved successfully!
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Profile Image Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#15B46A]">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#15B46A] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0F9456] transition-colors shadow-lg">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{user?.full_name}</h3>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            {user?.email && (
              <p className="text-sm text-gray-500 mt-2">{user.email}</p>
            )}
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#15B46A]" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    value={user?.email || ""}
                    className="pl-10 bg-gray-100"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="United States"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.location.href = getDashboardUrl()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#15B46A] hover:bg-[#0F9456] text-white shadow-lg"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-5 h-5" />
                      Save Changes
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* NEW: Change Password Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#15B46A]" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showPasswordSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">✓ Password changed successfully!</p>
              </div>
            )}
            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{passwordError}</p>
              </div>
            )}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password *
                </label>
                <Input
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                  placeholder="Enter your current password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password *
                </label>
                <Input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  placeholder="Enter new password (min. 6 characters)"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <Input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  placeholder="Re-enter new password"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#15B46A] hover:bg-[#0F9456] text-white shadow-lg"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Changing Password...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Change Password
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* NEW: Referral Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#15B46A]" />
              Referral Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-[#15B46A] to-[#0F9456] rounded-xl text-white">
                <p className="text-sm opacity-90 mb-2">Your Referral Code</p>
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-bold tracking-wider">
                    {user?.referral_code || "N/A"}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => {
                      navigator.clipboard.writeText(user?.referral_code || "");
                      alert("Referral code copied!");
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-xs opacity-75 mt-2">
                  Share with friends to earn rewards!
                </p>
              </div>

              <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-sm text-gray-600 mb-2">Referral Credit</p>
                <p className="text-4xl font-bold text-yellow-600">
                  ${user?.refferal_credit || 0}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Earned from {user?.referral_count || 0} successful referrals
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900 font-medium mb-2">
                How it works:
              </p>
              <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                <li>Share your referral code with friends</li>
                <li>They sign up using your code</li>
                <li>You both get $5 credit when they complete their first ride</li>
                <li>No limit on referrals!</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}