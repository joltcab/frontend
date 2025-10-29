import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useTranslation } from '@/components/i18n/useTranslation';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Send, Users, Car, Briefcase, Hotel, Radio, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MassNotifications() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    recipient_type: 'all',
    title: '',
    message: '',
    priority: 'normal'
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.functions.invoke('sendMassNotification', data);
      return response.data;
    },
    onSuccess: (data) => {
      alert(`${t('success.notification_sent')} - ${data.sent_count} notifications sent`);
      setFormData({
        recipient_type: 'all',
        title: '',
        message: '',
        priority: 'normal'
      });
    },
    onError: (error) => {
      alert(t('error.notification_failed'));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      alert('Please fill in all fields');
      return;
    }
    sendNotificationMutation.mutate(formData);
  };

  const recipientTypes = [
    { value: 'all', label: t('title.all_users'), icon: Bell, count: '∞' },
    { value: 'user', label: t('title.user'), icon: Users, count: null },
    { value: 'driver', label: t('title.driver'), icon: Car, count: null },
    { value: 'corporate', label: 'Corporate', icon: Briefcase, count: null },
    { value: 'hotel', label: 'Hotels', icon: Hotel, count: null },
    { value: 'dispatcher', label: 'Dispatchers', icon: Radio, count: null }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#15B46A]" />
            {t('menu.mass_notifications')}
          </CardTitle>
          <p className="text-sm text-gray-600">
            Send push notifications to specific user groups
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient Type Selection */}
            <div>
              <Label className="mb-4 block">{t('title.recipient_type')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {recipientTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.value}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFormData({ ...formData, recipient_type: type.value })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.recipient_type === type.value
                          ? 'border-[#15B46A] bg-green-50'
                          : 'border-gray-200 hover:border-[#15B46A]'
                      }`}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2 text-[#15B46A]" />
                      <p className="font-semibold text-sm">{type.label}</p>
                      {type.count && (
                        <p className="text-xs text-gray-500">{type.count} users</p>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Priority */}
            <div>
              <Label>{t('title.priority')}</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div>
              <Label>{t('title.notification_title')}</Label>
              <Input
                placeholder="Enter notification title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/50 characters
              </p>
            </div>

            {/* Message */}
            <div>
              <Label>{t('title.message')}</Label>
              <Textarea
                placeholder="Enter notification message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.message.length}/200 characters
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#15B46A] hover:bg-[#0F9456] h-14 text-lg"
              disabled={sendNotificationMutation.isPending}
            >
              {sendNotificationMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('button.sending')}...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  {t('button.send_notification')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      {(formData.title || formData.message) && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-xl">
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg shadow">
                <div className="w-10 h-10 bg-[#15B46A] rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{formData.title || 'Notification Title'}</p>
                  <p className="text-sm text-gray-600 mt-1">{formData.message || 'Notification message will appear here...'}</p>
                  <p className="text-xs text-gray-400 mt-2">Just now</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}