import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, Smartphone, Mail, MessageSquare, Car, 
  DollarSign, Star, AlertCircle, Loader2, Trash2 
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function NotificationSettings() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

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

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['notificationSettings', user?.email],
    queryFn: () => base44.entities.NotificationSettings.filter({ user_email: user?.email }),
    enabled: !!user,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['allNotifications', user?.email],
    queryFn: () => base44.entities.Notification.filter({ user_email: user?.email }, '-created_date'),
    enabled: !!user,
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }) => {
      const existing = settings.find(s => s.setting_key === key);
      if (existing) {
        return base44.entities.NotificationSettings.update(existing.id, { enabled: value });
      } else {
        return base44.entities.NotificationSettings.create({
          user_email: user.email,
          setting_key: key,
          enabled: value,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(notifications.map(n => base44.entities.Notification.delete(n.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
    },
  });

  const getSetting = (key) => {
    return settings.find(s => s.setting_key === key)?.enabled ?? true;
  };

  const notificationTypes = [
    {
      category: "Ride Notifications",
      icon: Car,
      color: "text-blue-600",
      settings: [
        { key: "ride_request", label: "New Ride Requests", description: "Get notified when someone requests a ride" },
        { key: "ride_accepted", label: "Ride Accepted", description: "When a driver accepts your ride" },
        { key: "ride_started", label: "Ride Started", description: "When your ride begins" },
        { key: "ride_completed", label: "Ride Completed", description: "When your ride is finished" },
        { key: "ride_cancelled", label: "Ride Cancelled", description: "When a ride is cancelled" },
      ],
    },
    {
      category: "Payment Notifications",
      icon: DollarSign,
      color: "text-green-600",
      settings: [
        { key: "payment_received", label: "Payment Received", description: "When you receive a payment" },
        { key: "payment_sent", label: "Payment Sent", description: "When a payment is processed" },
        { key: "withdrawal_completed", label: "Withdrawal Completed", description: "When a withdrawal is successful" },
        { key: "low_balance", label: "Low Balance Alert", description: "When your wallet balance is low" },
      ],
    },
    {
      category: "Communication",
      icon: MessageSquare,
      color: "text-purple-600",
      settings: [
        { key: "new_message", label: "New Messages", description: "When you receive a message" },
        { key: "new_review", label: "New Reviews", description: "When someone rates you" },
      ],
    },
    {
      category: "Promotions",
      icon: Star,
      color: "text-orange-600",
      settings: [
        { key: "promo_available", label: "Promo Codes", description: "New promo codes and offers" },
        { key: "special_offers", label: "Special Offers", description: "Exclusive deals and discounts" },
      ],
    },
  ];

  const channels = [
    { key: "push", label: "Push Notifications", icon: Smartphone, description: "Mobile app notifications" },
    { key: "email", label: "Email", icon: Mail, description: "Email notifications" },
    { key: "sms", label: "SMS", icon: MessageSquare, description: "Text message notifications" },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-[#15B46A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] rounded-3xl p-8 text-white shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-2">Notification Settings</h1>
          <p className="text-white/90">Manage how you receive notifications</p>
        </motion.div>

        {/* Notification Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#15B46A]" />
              Notification Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div key={channel.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{channel.label}</p>
                      <p className="text-sm text-gray-600">{channel.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={getSetting(`channel_${channel.key}`)}
                    onCheckedChange={(value) => 
                      updateSettingMutation.mutate({ key: `channel_${channel.key}`, value })
                    }
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Notification Types */}
        {notificationTypes.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${category.color}`} />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.settings.map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div>
                        <Label className="font-semibold text-gray-900">{setting.label}</Label>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                      <Switch
                        checked={getSetting(setting.key)}
                        onCheckedChange={(value) => 
                          updateSettingMutation.mutate({ key: setting.key, value })
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Notifications ({notifications.length})</CardTitle>
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm("Delete all notifications?")) {
                      clearAllMutation.mutate();
                    }
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600">No notifications</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(notification.created_date), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNotificationMutation.mutate(notification.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}