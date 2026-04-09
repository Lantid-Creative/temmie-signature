import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, Save, MapPin, Mail, Phone, Printer } from 'lucide-react';
import { useOrders, useUpdateOrder } from '@/hooks/useProducts';
import { format } from 'date-fns';

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: orders, isLoading } = useOrders();
  const updateOrder = useUpdateOrder();
  const [notes, setNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const order = orders?.find(o => o.id === id);

  if (isLoading) {
    return <AdminLayout><div className="flex items-center justify-center h-64"><div className="animate-pulse text-muted-foreground">Loading order...</div></div></AdminLayout>;
  }

  if (!order) {
    return <AdminLayout><div className="text-center py-12"><p className="text-muted-foreground">Order not found</p><Button variant="link" onClick={() => navigate('/admin/orders')}>Back to orders</Button></div></AdminLayout>;
  }

  const shippingAddr = order.shipping_address as Record<string, string> | null;
  const currentStepIndex = statusSteps.indexOf(order.status);

  const handleStatusChange = (status: string) => {
    updateOrder.mutate({ id: order.id, status });
  };

  const handleSaveNotes = () => {
    const noteText = trackingNumber 
      ? `${notes}\n\nTracking: ${trackingNumber}` 
      : notes;
    updateOrder.mutate({ id: order.id, notes: noteText });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/orders')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-serif font-bold">Order {order.order_number}</h1>
            <p className="text-sm text-muted-foreground">
              Placed on {format(new Date(order.created_at), 'MMMM dd, yyyy \'at\' h:mm a')}
            </p>
          </div>
          <Badge className={statusColors[order.status] || 'bg-muted'}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        {/* Status Timeline */}
        {order.status !== 'cancelled' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, i) => {
                  const Icon = statusIcons[step];
                  const isActive = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className={`text-xs font-medium capitalize ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step}
                        </span>
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 ${i < currentStepIndex ? 'bg-primary' : 'bg-muted'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Items ({order.order_items?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items?.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      {item.product_image ? (
                        <img src={item.product_image} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          {item.color && <span>Color: {item.color}</span>}
                          {item.cap_size && <span>Size: {item.cap_size}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₦{Number(item.price).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₦{Number(order.subtotal).toLocaleString()}</span>
                  </div>
                  {order.discount_amount && Number(order.discount_amount) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="text-green-600">-₦{Number(order.discount_amount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₦{Number(order.shipping_amount || 0).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₦{Number(order.total).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes & Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes & Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tracking Number</Label>
                  <Input
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Internal Notes</Label>
                  <Textarea
                    value={notes || order.notes || ''}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add notes about this order..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleSaveNotes} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Notes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Update Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={order.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{order.email}</span>
                </div>
                {order.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{order.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {shippingAddr && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    {shippingAddr.firstName && <p className="font-medium">{shippingAddr.firstName} {shippingAddr.lastName}</p>}
                    {shippingAddr.address && <p>{shippingAddr.address}</p>}
                    {(shippingAddr.city || shippingAddr.state) && (
                      <p>{[shippingAddr.city, shippingAddr.state].filter(Boolean).join(', ')}</p>
                    )}
                    {shippingAddr.country && <p>{shippingAddr.country}</p>}
                    {shippingAddr.zip && <p>{shippingAddr.zip}</p>}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetail;
