import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  Send,
  Users,
  ShoppingCart,
  Heart,
  Package,
  AlertCircle,
  Clock,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: 'marketing' | 'transactional' | 'automated';
  description: string;
}

const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to Trazzy Beauty! 💕',
    type: 'transactional',
    description: 'Sent when a new user signs up',
  },
  {
    id: 'order-confirmation',
    name: 'Order Confirmation',
    subject: 'Your Order is Confirmed! 🎉',
    type: 'transactional',
    description: 'Sent when an order is placed',
  },
  {
    id: 'order-shipped',
    name: 'Order Shipped',
    subject: 'Your Order is On Its Way! 📦',
    type: 'transactional',
    description: 'Sent when an order is shipped',
  },
  {
    id: 'abandoned-cart',
    name: 'Abandoned Cart',
    subject: "You Left Something Behind! 🛒",
    type: 'automated',
    description: 'Sent 24h after cart abandonment',
  },
  {
    id: 'wishlist-reminder',
    name: 'Wishlist Reminder',
    subject: 'Your Wishlist is Waiting! 💖',
    type: 'automated',
    description: 'Sent weekly for items in wishlist',
  },
  {
    id: 'back-in-stock',
    name: 'Back in Stock',
    subject: "It's Back! 🙌",
    type: 'automated',
    description: 'Sent when wishlisted item is restocked',
  },
];

const EmailMarketing = () => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [emailForm, setEmailForm] = useState({
    subject: '',
    preheader: '',
    headline: '',
    body: '',
    ctaText: '',
    ctaLink: '',
    audience: 'all',
  });

  const queryClient = useQueryClient();

  const sendEmailMutation = useMutation({
    mutationFn: async (data: typeof emailForm) => {
      const { error } = await supabase.functions.invoke('send-marketing-email', {
        body: data,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Email campaign sent successfully!');
      setIsComposeOpen(false);
      setEmailForm({
        subject: '',
        preheader: '',
        headline: '',
        body: '',
        ctaText: '',
        ctaLink: '',
        audience: 'all',
      });
    },
    onError: (error) => {
      toast.error('Failed to send email: ' + error.message);
    },
  });

  const testEmailMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase.functions.invoke('send-test-email', {
        body: { templateId },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Test email sent to admin email');
    },
    onError: (error) => {
      toast.error('Failed to send test email: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendEmailMutation.mutate(emailForm);
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'marketing':
        return <Mail className="h-4 w-4" />;
      case 'transactional':
        return <Package className="h-4 w-4" />;
      case 'automated':
        return <Clock className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'marketing':
        return <Badge className="bg-purple-500">Marketing</Badge>;
      case 'transactional':
        return <Badge className="bg-blue-500">Transactional</Badge>;
      case 'automated':
        return <Badge className="bg-green-500">Automated</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold">Email Marketing</h1>
            <p className="text-muted-foreground">Send campaigns and manage email templates</p>
          </div>
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Email Campaign</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="audience">Audience</Label>
                  <Select
                    value={emailForm.audience}
                    onValueChange={(value) => setEmailForm({ ...emailForm, audience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          All Subscribers
                        </div>
                      </SelectItem>
                      <SelectItem value="customers">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Past Customers
                        </div>
                      </SelectItem>
                      <SelectItem value="cart-abandoners">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Cart Abandoners
                        </div>
                      </SelectItem>
                      <SelectItem value="wishlist-users">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          Wishlist Users
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    placeholder="Your exclusive offer awaits! 🎁"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preheader">Preheader Text</Label>
                  <Input
                    id="preheader"
                    value={emailForm.preheader}
                    onChange={(e) => setEmailForm({ ...emailForm, preheader: e.target.value })}
                    placeholder="Don't miss out on this limited-time offer..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={emailForm.headline}
                    onChange={(e) => setEmailForm({ ...emailForm, headline: e.target.value })}
                    placeholder="Exclusive 20% Off!"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Email Body</Label>
                  <Textarea
                    id="body"
                    value={emailForm.body}
                    onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                    rows={6}
                    placeholder="Write your email content here..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ctaText">Button Text</Label>
                    <Input
                      id="ctaText"
                      value={emailForm.ctaText}
                      onChange={(e) => setEmailForm({ ...emailForm, ctaText: e.target.value })}
                      placeholder="Shop Now"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaLink">Button Link</Label>
                    <Input
                      id="ctaLink"
                      value={emailForm.ctaLink}
                      onChange={(e) => setEmailForm({ ...emailForm, ctaLink: e.target.value })}
                      placeholder="https://yourstore.com/shop"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsComposeOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={sendEmailMutation.isPending}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Campaign
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">1,234</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Emails Sent (30d)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">5,678</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">42.5%</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Click Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">8.3%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="history">Send History</TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>Manage your email templates for different occasions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getTemplateIcon(template.type)}
                            <div>
                              <p className="font-medium">{template.name}</p>
                              <p className="text-sm text-muted-foreground">{template.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{template.subject}</TableCell>
                        <TableCell>{getTypeBadge(template.type)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => testEmailMutation.mutate(template.id)}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Test
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation">
            <Card>
              <CardHeader>
                <CardTitle>Automated Emails</CardTitle>
                <CardDescription>Configure automated email triggers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-8 w-8 text-orange-500" />
                      <div>
                        <h4 className="font-medium">Abandoned Cart Recovery</h4>
                        <p className="text-sm text-muted-foreground">
                          Send email 24 hours after cart abandonment
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Heart className="h-8 w-8 text-pink-500" />
                      <div>
                        <h4 className="font-medium">Wishlist Reminder</h4>
                        <p className="text-sm text-muted-foreground">
                          Weekly reminder about wishlist items
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Order Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Confirmation, shipping, and delivery notifications
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-8 w-8 text-purple-500" />
                      <div>
                        <h4 className="font-medium">Back in Stock Alert</h4>
                        <p className="text-sm text-muted-foreground">
                          Notify when wishlisted items are restocked
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Send History</CardTitle>
                <CardDescription>Recent email campaigns and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-2" />
                  <p>No email campaigns sent yet</p>
                  <p className="text-sm">Start by creating your first campaign</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default EmailMarketing;
