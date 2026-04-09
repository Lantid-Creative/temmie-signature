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
import { Save, Store, Truck, CreditCard, Share2, Mail, Bell, Ruler, FileText, LayoutGrid, Globe } from 'lucide-react';
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
          <TabsList className="flex flex-wrap gap-1">
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
            <TabsTrigger value="size-guide" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              <span className="hidden sm:inline">Size Guide</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Content Pages</span>
            </TabsTrigger>
            <TabsTrigger value="footer" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Footer</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">SEO</span>
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
                      placeholder="Hello! I have a question about Temmie Signature products."
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

          <TabsContent value="size-guide">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Clothing Size Guide</CardTitle>
                  <CardDescription>Manage the clothing size chart shown on product pages (S, M, L, etc.)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Size Chart (JSON format)</Label>
                    <Textarea
                      value={getValue('size_guide_clothing', JSON.stringify([
                        { size: 'S', chest: '36-38', waist: '28-30', hips: '36-38' },
                        { size: 'M', chest: '38-40', waist: '30-32', hips: '38-40' },
                        { size: 'L', chest: '40-42', waist: '32-34', hips: '40-42' },
                        { size: 'XL', chest: '42-44', waist: '34-36', hips: '42-44' },
                        { size: 'XXL', chest: '44-46', waist: '36-38', hips: '44-46' },
                      ], null, 2))}
                      onChange={(e) => handleChange('size_guide_clothing', e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">Each row: size, chest, waist, hips (in inches)</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Shoe Size Guide</CardTitle>
                  <CardDescription>Manage the shoe size chart shown on shoe product pages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Size Chart (JSON format)</Label>
                    <Textarea
                      value={getValue('size_guide_shoes', JSON.stringify([
                        { size: '38', eu: '38', uk: '5', us: '6', cm: '24' },
                        { size: '39', eu: '39', uk: '6', us: '7', cm: '24.5' },
                        { size: '40', eu: '40', uk: '6.5', us: '7.5', cm: '25' },
                        { size: '41', eu: '41', uk: '7', us: '8', cm: '25.5' },
                        { size: '42', eu: '42', uk: '8', us: '9', cm: '26' },
                        { size: '43', eu: '43', uk: '9', us: '10', cm: '27' },
                        { size: '44', eu: '44', uk: '9.5', us: '10.5', cm: '27.5' },
                        { size: '45', eu: '45', uk: '10.5', us: '11.5', cm: '28' },
                      ], null, 2))}
                      onChange={(e) => handleChange('size_guide_shoes', e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">Each row: size, eu, uk, us, cm</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Size Guide Note</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={getValue('size_guide_note', 'All measurements are in inches. For the best fit, we recommend taking your measurements and comparing them with our size chart.')}
                    onChange={(e) => handleChange('size_guide_note', `"${e.target.value}"`)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Policy</CardTitle>
                  <CardDescription>Edit the privacy policy page content (HTML supported)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={getValue('privacy_policy_content')}
                    onChange={(e) => handleChange('privacy_policy_content', `"${e.target.value.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`)}
                    rows={15}
                    placeholder="Enter your privacy policy content..."
                  />
                  <p className="text-xs text-muted-foreground mt-2">Leave empty to use the default privacy policy.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Terms of Service</CardTitle>
                  <CardDescription>Edit the terms of service page content (HTML supported)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={getValue('terms_of_service_content')}
                    onChange={(e) => handleChange('terms_of_service_content', `"${e.target.value.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`)}
                    rows={15}
                    placeholder="Enter your terms of service content..."
                  />
                  <p className="text-xs text-muted-foreground mt-2">Leave empty to use the default terms of service.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>About Page Content</CardTitle>
                  <CardDescription>Edit the about page description</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={getValue('about_page_content')}
                    onChange={(e) => handleChange('about_page_content', `"${e.target.value.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`)}
                    rows={10}
                    placeholder="Enter your about page content..."
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="footer">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Footer Content</CardTitle>
                  <CardDescription>Customize the footer information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Footer Tagline</Label>
                    <Input
                      value={getValue('footer_tagline', 'Crafted for those who value strength, style, and sophistication. Best Feet, Best Fits.')}
                      onChange={(e) => handleChange('footer_tagline', `"${e.target.value}"`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Copyright Text</Label>
                    <Input
                      value={getValue('footer_copyright', '© 2026 Temmie Signature. All rights reserved.')}
                      onChange={(e) => handleChange('footer_copyright', `"${e.target.value}"`)}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Trust Badges</CardTitle>
                  <CardDescription>Customize the trust badges shown in the footer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Badge {i} Icon (emoji)</Label>
                        <Input
                          value={getValue(`trust_badge_${i}_icon`, ['🚚', '↩️', '🔒', '💬'][i - 1])}
                          onChange={(e) => handleChange(`trust_badge_${i}_icon`, `"${e.target.value}"`)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Badge {i} Text</Label>
                        <Input
                          value={getValue(`trust_badge_${i}_text`, ['Worldwide Shipping', 'Refund Policy', 'Secured Payment', 'Support 24/7'][i - 1])}
                          onChange={(e) => handleChange(`trust_badge_${i}_text`, `"${e.target.value}"`)}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="seo">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Global SEO Settings</CardTitle>
                  <CardDescription>Default SEO meta tags for your store</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Site Title</Label>
                    <Input
                      value={getValue('seo_site_title', 'Temmie Signature - Premium Fashion')}
                      onChange={(e) => handleChange('seo_site_title', `"${e.target.value}"`)}
                    />
                    <p className="text-xs text-muted-foreground">Recommended: Under 60 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea
                      value={getValue('seo_meta_description', 'Discover premium Nigerian fashion at Temmie Signature. Shop designer kaftans, agbada, suits, and shoes.')}
                      onChange={(e) => handleChange('seo_meta_description', `"${e.target.value}"`)}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">Recommended: 150-160 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Keywords</Label>
                    <Input
                      value={getValue('seo_keywords', 'Nigerian fashion, kaftan, agbada, suits, shoes, Temmie Signature')}
                      onChange={(e) => handleChange('seo_keywords', `"${e.target.value}"`)}
                      placeholder="Comma-separated keywords"
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>OG Image URL</Label>
                    <Input
                      value={getValue('seo_og_image')}
                      onChange={(e) => handleChange('seo_og_image', `"${e.target.value}"`)}
                      placeholder="https://... (1200x630px recommended)"
                    />
                    <p className="text-xs text-muted-foreground">Image shown when your site is shared on social media</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Google Analytics ID</Label>
                    <Input
                      value={getValue('seo_ga_id')}
                      onChange={(e) => handleChange('seo_ga_id', `"${e.target.value}"`)}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
