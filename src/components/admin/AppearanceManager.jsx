import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { joltcab } from "@/lib/joltcab-api";
import appConfig from "@/config/app";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Upload, Plus, Trash2, Palette, Eye, CheckCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createPageUrl } from "@/utils";

export default function AppearanceManager() {
  const [headerSettings, setHeaderSettings] = useState({});
  const [footerSettings, setFooterSettings] = useState({});
  const [generalSettings, setGeneralSettings] = useState({});
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const queryClient = useQueryClient();

  const { data: appearanceConfigs = [] } = useQuery({
    queryKey: ['appearanceSettings'],
    queryFn: () => joltcab.entities.AppearanceSettings.list(),
  });

  useEffect(() => {
    if (appearanceConfigs.length > 0) {
      const header = appearanceConfigs.find(c => c.section === 'header') || {};
      const footer = appearanceConfigs.find(c => c.section === 'footer') || {};
      const general = appearanceConfigs.find(c => c.section === 'general') || {};
      
      setHeaderSettings({
        logo_url: header.logo_url || appConfig.logo,
        site_name: header.site_name || 'JoltCab',
        tagline: header.tagline || 'Your ride, your price',
        menu_items: header.menu_items || []
      });
      
      setFooterSettings({
        footer_text: footer.footer_text || `© ${new Date().getFullYear()} JoltCab. All rights reserved.`,
        contact_info: footer.contact_info || {},
        social_links: footer.social_links || {}
      });
      
      setGeneralSettings({
        primary_color: general.primary_color || '#15B46A',
        secondary_color: general.secondary_color || '#0F9456',
        show_whatsapp_button: general.show_whatsapp_button !== false,
        whatsapp_number: general.whatsapp_number || '+14707484747'
      });
    }
  }, [appearanceConfigs]);

  const createOrUpdateMutation = useMutation({
    mutationFn: async (data) => {
      const existing = appearanceConfigs.find(c => c.section === data.section);
      if (existing) {
        return joltcab.entities.AppearanceSettings.update(existing.id, data);
      } else {
        return joltcab.entities.AppearanceSettings.create(data);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appearanceSettings'] }),
  });

  const handleSave = async (section, data) => {
    setSaving(section);
    try {
      await createOrUpdateMutation.mutateAsync({ section, ...data });
      setSaved(section);
      setTimeout(() => setSaved(null), 3000);
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving settings: " + error.message);
    } finally {
      setSaving(null);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const { file_url } = await joltcab.integrations.Core.UploadFile({ file });
      setHeaderSettings(prev => ({ ...prev, logo_url: file_url }));
      alert("✓ Logo uploaded! Click 'Save Header' to apply changes.");
    } catch (error) {
      alert("Failed to upload logo: " + error.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const addMenuItem = () => {
    setHeaderSettings(prev => ({
      ...prev,
      menu_items: [...(prev.menu_items || []), { label: '', url: '', order: (prev.menu_items || []).length }]
    }));
  };

  const removeMenuItem = (index) => {
    setHeaderSettings(prev => ({
      ...prev,
      menu_items: (prev.menu_items || []).filter((_, i) => i !== index)
    }));
  };

  const updateMenuItem = (index, field, value) => {
    setHeaderSettings(prev => ({
      ...prev,
      menu_items: (prev.menu_items || []).map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header with Preview Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Appearance Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Customize your website's look and feel</p>
        </div>

        <Button
          variant="outline"
          onClick={() => window.open(createPageUrl('Home'), '_blank')}
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Preview Site
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>

      {/* Info Alert */}
      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20">
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          💡 <strong>Tip:</strong> After saving changes, click "Preview Site" to see them live on your website!
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="header" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="header" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Header
          </TabsTrigger>
          <TabsTrigger value="footer" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Footer
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            General
          </TabsTrigger>
        </TabsList>

        {/* HEADER SETTINGS */}
        <TabsContent value="header" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Header Configuration</CardTitle>
              <CardDescription>Customize your website header and navigation menu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Preview */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <Label className="text-sm font-semibold mb-3 block">Current Logo Preview</Label>
                <div className="flex items-center gap-4">
                  <img 
                    src={headerSettings.logo_url} 
                    alt="Logo" 
                    className="h-20 w-20 object-contain rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white p-2" 
                  />
                  <div className="flex-1">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('header-logo').click()}
                      disabled={uploadingLogo}
                      className="w-full sm:w-auto"
                    >
                      {uploadingLogo ? (
                        <>
                          <Upload className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Change Logo
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Recommended: Square image, 200x200px</p>
                  </div>
                </div>
                <input
                  type="file"
                  id="header-logo"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>

              {/* Site Name */}
              <div>
                <Label>Site Name</Label>
                <Input
                  value={headerSettings.site_name || ''}
                  onChange={(e) => setHeaderSettings(prev => ({ ...prev, site_name: e.target.value }))}
                  placeholder="JoltCab"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">This appears next to your logo</p>
              </div>

              {/* Tagline */}
              <div>
                <Label>Tagline</Label>
                <Input
                  value={headerSettings.tagline || ''}
                  onChange={(e) => setHeaderSettings(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="Your ride, your price"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">Short description of your service</p>
              </div>

              {/* Menu Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Navigation Menu</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addMenuItem}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                {(headerSettings.menu_items || []).length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">No menu items yet. Click "Add Item" to create one.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(headerSettings.menu_items || []).map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <Input
                            placeholder="Label (e.g., Services)"
                            value={item.label}
                            onChange={(e) => updateMenuItem(idx, 'label', e.target.value)}
                          />
                          <Input
                            placeholder="URL (e.g., #services)"
                            value={item.url}
                            onChange={(e) => updateMenuItem(idx, 'url', e.target.value)}
                          />
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeMenuItem(idx)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                {saved === 'header' && (
                  <Alert className="flex-1 bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Header settings saved! Refresh your site to see changes.
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  onClick={() => handleSave('header', headerSettings)}
                  disabled={saving === 'header'}
                  className="bg-[#15B46A] hover:bg-[#0F9456]"
                >
                  {saving === 'header' ? (
                    <>
                      <Save className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Header
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FOOTER SETTINGS */}
        <TabsContent value="footer" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Footer Configuration</CardTitle>
              <CardDescription>Customize your website footer, social links and contact info</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Copyright Text */}
              <div>
                <Label>Footer Copyright Text</Label>
                <Input
                  value={footerSettings.footer_text || ''}
                  onChange={(e) => setFooterSettings(prev => ({ ...prev, footer_text: e.target.value }))}
                  placeholder={`© ${new Date().getFullYear()} JoltCab. All rights reserved.`}
                  className="mt-2"
                />
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Contact Information</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Email</Label>
                    <Input
                      placeholder="support@joltcab.com"
                      value={footerSettings.contact_info?.email || ''}
                      onChange={(e) => setFooterSettings(prev => ({ 
                        ...prev, 
                        contact_info: { ...(prev.contact_info || {}), email: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Phone</Label>
                    <Input
                      placeholder="+1 (234) 567-8900"
                      value={footerSettings.contact_info?.phone || ''}
                      onChange={(e) => setFooterSettings(prev => ({ 
                        ...prev, 
                        contact_info: { ...(prev.contact_info || {}), phone: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm">Address</Label>
                    <Input
                      placeholder="123 Main St, City, Country"
                      value={footerSettings.contact_info?.address || ''}
                      onChange={(e) => setFooterSettings(prev => ({ 
                        ...prev, 
                        contact_info: { ...(prev.contact_info || {}), address: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Social Media Links</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Facebook URL</Label>
                    <Input
                      placeholder="https://facebook.com/yourpage"
                      value={footerSettings.social_links?.facebook || ''}
                      onChange={(e) => setFooterSettings(prev => ({ 
                        ...prev, 
                        social_links: { ...(prev.social_links || {}), facebook: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Instagram URL</Label>
                    <Input
                      placeholder="https://instagram.com/yourpage"
                      value={footerSettings.social_links?.instagram || ''}
                      onChange={(e) => setFooterSettings(prev => ({ 
                        ...prev, 
                        social_links: { ...(prev.social_links || {}), instagram: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Twitter URL</Label>
                    <Input
                      placeholder="https://twitter.com/yourpage"
                      value={footerSettings.social_links?.twitter || ''}
                      onChange={(e) => setFooterSettings(prev => ({ 
                        ...prev, 
                        social_links: { ...(prev.social_links || {}), twitter: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">LinkedIn URL</Label>
                    <Input
                      placeholder="https://linkedin.com/company/yourpage"
                      value={footerSettings.social_links?.linkedin || ''}
                      onChange={(e) => setFooterSettings(prev => ({ 
                        ...prev, 
                        social_links: { ...(prev.social_links || {}), linkedin: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                {saved === 'footer' && (
                  <Alert className="flex-1 bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Footer settings saved! Refresh your site to see changes.
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  onClick={() => handleSave('footer', footerSettings)}
                  disabled={saving === 'footer'}
                  className="bg-[#15B46A] hover:bg-[#0F9456]"
                >
                  {saving === 'footer' ? (
                    <>
                      <Save className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Footer
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GENERAL SETTINGS */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors & Features</CardTitle>
              <CardDescription>Customize your brand colors and additional features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Brand Colors */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Primary Color</Label>
                  <div className="flex gap-3 mt-2">
                    <input
                      type="color"
                      value={generalSettings.primary_color || '#15B46A'}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                      className="w-20 h-12 rounded border cursor-pointer"
                    />
                    <Input
                      value={generalSettings.primary_color || '#15B46A'}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                      placeholder="#15B46A"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Main brand color used for buttons and accents</p>
                </div>
                <div>
                  <Label>Secondary Color</Label>
                  <div className="flex gap-3 mt-2">
                    <input
                      type="color"
                      value={generalSettings.secondary_color || '#0F9456'}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, secondary_color: e.target.value }))}
                      className="w-20 h-12 rounded border cursor-pointer"
                    />
                    <Input
                      value={generalSettings.secondary_color || '#0F9456'}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, secondary_color: e.target.value }))}
                      placeholder="#0F9456"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Secondary color for gradients and hover effects</p>
                </div>
              </div>

              {/* Color Preview */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <Label className="text-sm font-semibold mb-3 block">Color Preview</Label>
                <div className="flex gap-4">
                  <div 
                    className="flex-1 h-20 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg"
                    style={{ backgroundColor: generalSettings.primary_color }}
                  >
                    Primary
                  </div>
                  <div 
                    className="flex-1 h-20 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg"
                    style={{ backgroundColor: generalSettings.secondary_color }}
                  >
                    Secondary
                  </div>
                  <div 
                    className="flex-1 h-20 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg"
                    style={{ 
                      background: `linear-gradient(to right, ${generalSettings.primary_color}, ${generalSettings.secondary_color})`
                    }}
                  >
                    Gradient
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold">WhatsApp Floating Button</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Show a floating WhatsApp button on all pages for instant customer support
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.show_whatsapp_button !== false}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, show_whatsapp_button: checked }))}
                  />
                </div>

                {generalSettings.show_whatsapp_button !== false && (
                  <div>
                    <Label>WhatsApp Number</Label>
                    <Input
                      value={generalSettings.whatsapp_number || ''}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                      placeholder="+14707484747"
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +1 for USA)</p>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                {saved === 'general' && (
                  <Alert className="flex-1 bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      General settings saved! Refresh your site to see changes.
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  onClick={() => handleSave('general', generalSettings)}
                  disabled={saving === 'general'}
                  className="bg-[#15B46A] hover:bg-[#0F9456]"
                >
                  {saving === 'general' ? (
                    <>
                      <Save className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}