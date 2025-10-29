import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useTranslation } from '@/components/i18n/useTranslation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Phone, Send, Loader2, ExternalLink } from 'lucide-react';

export default function SMSSettings() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('This is a test SMS from JoltCab');

  const [formData, setFormData] = useState({
    twilio_account_sid: '',
    twilio_auth_token: '',
    twilio_phone_number: '',
    is_active: true
  });

  const { data: config } = useQuery({
    queryKey: ['systemConfig', 'sms'],
    queryFn: async () => {
      const configs = await base44.entities.SystemConfiguration.filter({
        config_category: 'sms'
      });
      return configs;
    }
  });

  useEffect(() => {
    if (config && config.length > 0) {
      const configMap = {};
      config.forEach(c => {
        configMap[c.config_key] = c.config_value;
      });
      setFormData({
        twilio_account_sid: configMap.twilio_account_sid || '',
        twilio_auth_token: '',
        twilio_phone_number: configMap.twilio_phone_number || '',
        is_active: configMap.sms_active === 'true'
      });
    }
  }, [config]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const updates = [
        { key: 'twilio_account_sid', value: data.twilio_account_sid },
        { key: 'twilio_phone_number', value: data.twilio_phone_number },
        { key: 'sms_active', value: String(data.is_active) }
      ];

      if (data.twilio_auth_token) {
        updates.push({ key: 'twilio_auth_token', value: data.twilio_auth_token });
      }

      for (const update of updates) {
        const existing = config?.find(c => c.config_key === update.key);
        if (existing) {
          await base44.entities.SystemConfiguration.update(existing.id, {
            config_value: update.value
          });
        } else {
          await base44.entities.SystemConfiguration.create({
            config_key: update.key,
            config_value: update.value,
            config_category: 'sms',
            data_type: 'string'
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['systemConfig']);
      alert(t('success.update'));
    }
  });

  const testSMSMutation = useMutation({
    mutationFn: async ({ phone, message }) => {
      const response = await base44.functions.invoke('sendSMS', {
        to: phone,
        message: message
      });
      return response.data;
    },
    onSuccess: () => {
      alert('Test SMS sent successfully!');
    },
    onError: (error) => {
      alert('Failed to send test SMS: ' + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleTestSMS = () => {
    if (!testPhone || !testMessage) {
      alert('Please enter phone number and message');
      return;
    }
    testSMSMutation.mutate({ phone: testPhone, message: testMessage });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#15B46A]" />
            {t('menu.sms_settings')}
          </CardTitle>
          <p className="text-sm text-gray-600">
            Configure Twilio SMS integration for JoltCab
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Twilio Account SID *</Label>
              <Input
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={formData.twilio_account_sid}
                onChange={(e) => setFormData({ ...formData, twilio_account_sid: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Twilio Auth Token *</Label>
              <Input
                type="password"
                placeholder="Enter new token (leave empty to keep current)"
                value={formData.twilio_auth_token}
                onChange={(e) => setFormData({ ...formData, twilio_auth_token: e.target.value })}
              />
            </div>

            <div>
              <Label>Twilio Phone Number *</Label>
              <Input
                placeholder="+1234567890"
                value={formData.twilio_phone_number}
                onChange={(e) => setFormData({ ...formData, twilio_phone_number: e.target.value })}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Include country code (e.g., +1 for US)
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">SMS System Active</p>
                <p className="text-sm text-gray-600">Enable/disable SMS sending</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#15B46A] hover:bg-[#0F9456] h-12"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {t('button.save')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Test SMS */}
      <Card>
        <CardHeader>
          <CardTitle>Test SMS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Phone Number (with country code)</Label>
            <Input
              type="tel"
              placeholder="+1234567890"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
            />
          </div>

          <div>
            <Label>Message</Label>
            <Textarea
              placeholder="Enter test message..."
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {testMessage.length}/160 characters
            </p>
          </div>

          <Button
            onClick={handleTestSMS}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12"
            disabled={testSMSMutation.isPending}
          >
            {testSMSMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Test SMS
              </>
            )}
          </Button>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Twilio Setup Guide
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 mb-3">
              <li>Create a Twilio account at twilio.com</li>
              <li>Go to Console Dashboard</li>
              <li>Copy Account SID and Auth Token</li>
              <li>Buy a phone number</li>
              <li>Configure the number for SMS</li>
            </ol>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.twilio.com/console', '_blank')}
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Twilio Console
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}