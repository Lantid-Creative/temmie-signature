import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Save, Store, Truck, CreditCard, Share2, Mail, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type SiteSetting = Tables<'site_settings'>;

interface SettingsData {
  [key: string]: string | number | boolean;
}

const Settings = () => {
  const [settings, setSettings] = useState<SettingsData>({});
  const [hasChanges, setHasChanges] = useState(false);

  const queryClient = useQueryClient();

  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      return data as SiteSetting[];
    },
  });

  useEffect(() => {
    if (siteSettings) {
      const settingsMap: SettingsData = {};
      siteSettings.forEach((setting) => {
        settingsMap[setting.key] = setting.value as string | number | boolean;
      });
      setSettings(settingsMap);
    }
  }, [siteSettings]);

  const updateMutation = useMutation({
    mutationFn: async (updates: { key: string; value: unknown }[]) => {
      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key: update.key, value: update.value as never }, { onConflict: 'key' });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Settings saved successfully');
      setHasChanges(false);
    },
    onError: (error) => {
      toast.error('Failed to save settings: ' + error.message);
    },
  });

  const handleChange = (key: string, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
    }));
    updateMutation.mutate(updates);
  };

  const getValue = (key: string, defaultValue: string = '') => {
    const value = settings[key];
    if (typeof value === 'string') {
      // Remove surrounding quotes if present (JSON stored values)
      return value.replace(/^"|"$/g, '');
    }
    return value?.toString() || defaultValue;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading settings...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold">Store Settings</h1>
            <p className="text-muted-foreground">Configure your store settings and preferences</p>
          </div>
          <Button onClick={handleSave} disabled={!hasChanges || updateMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Shipping</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>Basic information about your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store_name">Store Name</Label>
                    <Input
                      id="store_name"
                      value={getValue('store_name')}
                      onChange={(e) => handleChange('store_name', `"${e.target.value}"`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store_email">Store Email</Label>
                    <Input
                      id="store_email"
                      type="email"
                      value={getValue('store_email')}
                      onChange={(e) => handleChange('store_email', `"${e.target.value}"`)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store_phone">Store Phone</Label>
                    <Input
                      id="store_phone"
                      value={getValue('store_phone')}
                      onChange={(e) => handleChange('store_phone', `"${e.target.value}"`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                    <Input
                      id="whatsapp_number"
                      value={getValue('whatsapp_number')}
                      onChange={(e) => handleChange('whatsapp_number', `"${e.target.value}"`)}
                      placeholder="+254700000000"
                    />
                    <p className="text-xs text-muted-foreground">
                      Include country code (e.g., +254 for Kenya)
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_message">WhatsApp Welcome Message</Label>
                  <Input
                    id="whatsapp_message"
                    value={getValue('whatsapp_message')}
                    onChange={(e) => handleChange('whatsapp_message', `"${e.target.value}"`)}
                    placeholder="Hello! I have a question about Trazzy Beauty products."
                  />
                  <p className="text-xs text-muted-foreground">
                    Pre-filled message when customers click the WhatsApp button
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store_address">Store Address</Label>
                  <Textarea
                    id="store_address"
                    value={getValue('store_address')}
                    onChange={(e) => handleChange('store_address', `"${e.target.value}"`)}
                    rows={3}
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={getValue('currency', 'USD')}
                      onChange={(e) => handleChange('currency', `"${e.target.value}"`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency_symbol">Currency Symbol</Label>
                    <Input
                      id="currency_symbol"
                      value={getValue('currency_symbol', '$')}
                      onChange={(e) => handleChange('currency_symbol', `"${e.target.value}"`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                    <Input
                      id="tax_rate"
                      type="number"
                      step="0.01"
                      value={getValue('tax_rate', '0')}
                      onChange={(e) => handleChange('tax_rate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Settings</CardTitle>
                <CardDescription>Configure shipping rates and free shipping thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipping_rate">Default Shipping Rate ($)</Label>
                    <Input
                      id="shipping_rate"
                      type="number"
                      step="0.01"
                      value={getValue('shipping_rate', '9.99')}
                      onChange={(e) => handleChange('shipping_rate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="free_shipping_threshold">Free Shipping Threshold ($)</Label>
                    <Input
                      id="free_shipping_threshold"
                      type="number"
                      step="0.01"
                      value={getValue('free_shipping_threshold', '100')}
                      onChange={(e) =>
                        handleChange('free_shipping_threshold', parseFloat(e.target.value) || 0)
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Orders above this amount get free shipping
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping_countries">Shipping Countries</Label>
                  <Textarea
                    id="shipping_countries"
                    value={getValue('shipping_countries')}
                    onChange={(e) => handleChange('shipping_countries', `"${e.target.value}"`)}
                    placeholder="USA, Canada, UK, Australia..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure payment methods and options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Stripe Integration</h4>
                      <p className="text-sm text-muted-foreground">
                        Connect your Stripe account to accept payments
                      </p>
                    </div>
                  </div>
                  <Button className="mt-4" variant="outline">
                    Configure Stripe
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_instructions">Payment Instructions</Label>
                  <Textarea
                    id="payment_instructions"
                    value={getValue('payment_instructions')}
                    onChange={(e) => handleChange('payment_instructions', `"${e.target.value}"`)}
                    placeholder="Any special payment instructions..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Link your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="social_instagram">Instagram URL</Label>
                    <Input
                      id="social_instagram"
                      value={getValue('social_instagram')}
                      onChange={(e) => handleChange('social_instagram', `"${e.target.value}"`)}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_facebook">Facebook URL</Label>
                    <Input
                      id="social_facebook"
                      value={getValue('social_facebook')}
                      onChange={(e) => handleChange('social_facebook', `"${e.target.value}"`)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="social_twitter">Twitter/X URL</Label>
                    <Input
                      id="social_twitter"
                      value={getValue('social_twitter')}
                      onChange={(e) => handleChange('social_twitter', `"${e.target.value}"`)}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_tiktok">TikTok URL</Label>
                    <Input
                      id="social_tiktok"
                      value={getValue('social_tiktok')}
                      onChange={(e) => handleChange('social_tiktok', `"${e.target.value}"`)}
                      placeholder="https://tiktok.com/..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="social_youtube">YouTube URL</Label>
                    <Input
                      id="social_youtube"
                      value={getValue('social_youtube')}
                      onChange={(e) => handleChange('social_youtube', `"${e.target.value}"`)}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_pinterest">Pinterest URL</Label>
                    <Input
                      id="social_pinterest"
                      value={getValue('social_pinterest')}
                      onChange={(e) => handleChange('social_pinterest', `"${e.target.value}"`)}
                      placeholder="https://pinterest.com/..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Configure email notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notification_email">Notification Email</Label>
                  <Input
                    id="notification_email"
                    type="email"
                    value={getValue('notification_email')}
                    onChange={(e) => handleChange('notification_email', `"${e.target.value}"`)}
                    placeholder="notifications@yourstore.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address to receive order notifications
                  </p>
                </div>
                <Separator />
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Mail className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1">
                    <h4 className="font-medium">Email Marketing</h4>
                    <p className="text-sm text-muted-foreground">
                      Send promotional emails and newsletters
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="/admin/email-marketing">Manage Emails</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
