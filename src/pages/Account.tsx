import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { User, Package, Heart, Settings, LogOut, Shield, Camera, MapPin, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  subtotal: number;
  shipping_amount: number | null;
  created_at: string;
  shipping_address: any;
  order_items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  color: string | null;
  cap_size: string | null;
}

export default function Account() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
    } else if (data) {
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
      });
    }
    setIsLoading(false);
  };

  const fetchOrders = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('orders')
      .select('id, order_number, status, total, subtotal, shipping_amount, created_at, shipping_address, order_items(id, product_name, product_image, quantity, price, color, cap_size)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
      })
      .eq('user_id', user.id);
    
    if (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } else {
      toast.success('Profile updated successfully');
      fetchProfile();
    }
    setIsSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error('Failed to upload avatar');
      console.error('Error uploading avatar:', uploadError);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('user_id', user.id);

    if (updateError) {
      toast.error('Failed to update avatar');
    } else {
      toast.success('Avatar updated successfully');
      fetchProfile();
    }
    setIsUploading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.success('Signed out successfully');
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
      pending: { variant: 'secondary', icon: Clock },
      processing: { variant: 'default', icon: Package },
      shipped: { variant: 'default', icon: Truck },
      delivered: { variant: 'default', icon: CheckCircle },
      cancelled: { variant: 'destructive', icon: XCircle },
    };
    const { variant, icon: Icon } = config[status] || { variant: 'secondary' as const, icon: Clock };
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getOrderTimeline = (status: string) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, i) => ({
      label: step.charAt(0).toUpperCase() + step.slice(1),
      completed: i <= currentIndex,
      current: i === currentIndex,
    }));
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-semibold">{profile?.full_name || 'Welcome!'}</h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                    {isAdmin && (
                      <Badge variant="default" className="gap-1">
                        <Shield className="w-3 h-3" />
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isAdmin && (
                    <Button variant="outline" asChild>
                      <Link to="/admin">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    </Button>
                  )}
                  <Button variant="destructive" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Wishlist</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your recent orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                      <Button asChild>
                        <Link to="/shop">Browse Products</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => {
                        const timeline = order.status !== 'cancelled' ? getOrderTimeline(order.status) : null;
                        return (
                          <div key={order.id} className="border rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between p-4 bg-muted/30">
                              <div>
                                <p className="font-medium">{order.order_number}</p>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(order.created_at), 'MMMM d, yyyy')}
                                </p>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                <p className="font-serif font-semibold text-lg">${Number(order.total).toFixed(2)}</p>
                                {getStatusBadge(order.status)}
                              </div>
                            </div>
                            {timeline && (
                              <div className="px-4 py-3 border-b">
                                <div className="flex items-center justify-between">
                                  {timeline.map((step, i) => (
                                    <div key={step.label} className="flex items-center flex-1">
                                      <div className="flex flex-col items-center gap-1">
                                        <div className={`w-3 h-3 rounded-full ${step.completed ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                        <span className={`text-xs ${step.current ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                          {step.label}
                                        </span>
                                      </div>
                                      {i < timeline.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-1 mt-[-1rem] ${step.completed ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {order.order_items && order.order_items.length > 0 && (
                              <div className="p-4 space-y-3">
                                {order.order_items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-3">
                                    {item.product_image ? (
                                      <img src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded object-cover" />
                                    ) : (
                                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                                        <Package className="w-5 h-5 text-muted-foreground" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{item.product_name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {item.color && item.color}{item.cap_size && ` / ${item.cap_size}`} × {item.quantity}
                                      </p>
                                    </div>
                                    <p className="text-sm font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>My Wishlist</CardTitle>
                  <CardDescription>Products you've saved for later</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">View your wishlist</h3>
                    <p className="text-muted-foreground mb-4">See all the products you've saved</p>
                    <Button asChild>
                      <Link to="/wishlist">Go to Wishlist</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
