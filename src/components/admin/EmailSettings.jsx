import React, { useState, useEffect } from 'react';
import joltcab from '@/lib/joltcab-api';
import { useTranslation } from '@/components/i18n/useTranslation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Send, Settings, TestTube, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmailSettings() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [testEmail, setTestEmail] = useState('');
  const [testStatus, setTestStatus] = useState(null);

  const [formData, setFormData] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    sender_email: '',
    sender_name: 'JoltCab',
    use_ssl: false,
    is_active: true
  });

  const { data: settings } = useQuery({
    queryKey: ['emailSettings'],
    queryFn: async () => {
  const result = await joltcab.entities.EmailSettings.filter({});
      return result[0];
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        smtp_host: settings.smtp_host || '',
        smtp_port: settings.smtp_port || 587,
        smtp_user: settings.smtp_user || '',
        smtp_password: '', // Don't load password
        sender_email: settings.sender_email || '',
        sender_name: settings.sender_name || 'JoltCab',
        use_ssl: settings.use_ssl || false,
        is_active: settings.is_active !== false
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
  return await joltcab.entities.EmailSettings.update(settings.id, data);
      } else {
  return await joltcab.entities.EmailSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['emailSettings']);
      alert(t('success.update'));
    }
  });

  const testEmailMutation = useMutation({
    mutationFn: async (email) => {
  const response = await joltcab.functions.invoke('sendTestEmail', { to: email });
      return response.data;
    },
    onSuccess: () => {
      setTestStatus('success');
      setTimeout(() => setTestStatus(null), 5000);
    },
    onError: () => {
      setTestStatus('error');
      setTimeout(() => setTestStatus(null), 5000);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleTestEmail = () => {
    if (!testEmail) {
      alert('Please enter an email address');
      return;
    }
    testEmailMutation.mutate(testEmail);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            SMTP Settings
          </TabsTrigger>
          <TabsTrigger value="test">
            <TestTube className="w-4 h-4 mr-2" />
            Test Email
          </TabsTrigger>
        </TabsList>

        {/* SMTP Settings */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-6 h-6 text-[#15B46A]" />
                {t('menu.email_settings')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>SMTP Host *</Label>
                    <Input
                      placeholder="smtp.gmail.com"
                      value={formData.smtp_host}
                      onChange={(e) => setFormData({ ...formData, smtp_host: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>SMTP Port *</Label>
                    <Input
                      type="number"
                      placeholder="587"
                      value={formData.smtp_port}
                      onChange={(e) => setFormData({ ...formData, smtp_port: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>SMTP Username (Email) *</Label>
                  <Input
                    type="email"
                    placeholder="notifications@joltcab.com"
                    value={formData.smtp_user}
                    onChange={(e) => setFormData({ ...formData, smtp_user: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>SMTP Password *</Label>
                  <Input
                    type="password"
                    placeholder="Enter new password (leave empty to keep current)"
                    value={formData.smtp_password}
                    onChange={(e) => setFormData({ ...formData, smtp_password: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    For Gmail, use an App-Specific Password
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Sender Email *</Label>
                    <Input
                      type="email"
                      placeholder="noreply@joltcab.com"
                      value={formData.sender_email}
                      onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Sender Name *</Label>
                    <Input
                      placeholder="JoltCab"
                      value={formData.sender_name}
                      onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">Use SSL</p>
                    <p className="text-sm text-gray-600">Enable SSL instead of TLS</p>
                  </div>
                  <Switch
                    checked={formData.use_ssl}
                    onCheckedChange={(checked) => setFormData({ ...formData, use_ssl: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">Email System Active</p>
                    <p className="text-sm text-gray-600">Enable/disable email sending</p>
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
                      {t('button.saving')}...
                    </>
                  ) : (
                    <>
                      <Settings className="w-5 h-5 mr-2" />
                      {t('button.save')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Email */}
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>{t('button.test_email')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Recipient Email</Label>
                <Input
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>

              <Button
                onClick={handleTestEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                disabled={testEmailMutation.isPending}
              >
                {testEmailMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Test Email
                  </>
                )}
              </Button>

              {testStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    testStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {testStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">Test email sent successfully!</p>
                        <p className="text-sm text-green-700">Check your inbox</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-600" />
                      <div>
                        <p className="font-semibold text-red-900">Failed to send test email</p>
                        <p className="text-sm text-red-700">Please check your SMTP settings</p>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">📧 Gmail Setup Guide</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Go to myaccount.google.com/apppasswords</li>
                  <li>Select "Mail" as the app</li>
                  <li>Generate a 16-character password</li>
                  <li>Use that password (NOT your Gmail password)</li>
                  <li>SMTP Host: smtp.gmail.com, Port: 587</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}