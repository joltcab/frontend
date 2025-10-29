
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Camera, Save, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminProfile({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    country: user?.country || '',
    profile_image: user?.profile_image || ''
  });
  const [success, setSuccess] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      if (onUpdate) onUpdate();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadFormData = new FormData(); // Renamed to avoid conflict with state formData
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'profiles');
      
      const { data } = await base44.functions.invoke('r2Upload', uploadFormData);
      
      if (!data.success) {
        throw new Error('Failed to upload image');
      }
      
      setFormData((prevFormData) => ({ ...prevFormData, profile_image: data.file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Profile</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your personal information</p>
      </div>

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            ✅ Profile updated successfully!
          </AlertDescription>
        </Alert>
      )}

      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={formData.profile_image} />
                <AvatarFallback className="bg-gradient-to-br from-[#15B46A] to-[#0F9456] text-white text-2xl">
                  {formData.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <Camera className="w-4 h-4" />
                    Upload Photo
                  </div>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  JPG, PNG or GIF (max. 2MB)
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="dark:text-gray-300">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="dark:text-gray-300">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  value={user?.email}
                  disabled
                  className="bg-gray-100 dark:bg-gray-600 dark:text-gray-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label className="dark:text-gray-300">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="dark:text-gray-300">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  City
                </Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="New York"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="dark:text-gray-300">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Country
                </Label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="United States"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Account Info */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{user?.role}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400 capitalize">{user?.status}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(user?.created_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">User ID</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white truncate">{user?.id}</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="bg-[#15B46A] hover:bg-[#0F9456] px-8"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
