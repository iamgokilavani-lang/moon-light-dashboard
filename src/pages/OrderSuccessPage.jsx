import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ArrowRight,
  Clock,
  Home,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const { orders } = useShop();

  const order = orders.find(o => o.id === orderId) || orders[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <Link to="/" className="mt-4 inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-semibold">
          Return to Store
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8">
      {/* Success Badge */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-soft text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 size={36} />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Payment Authorized</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Thank you for your purchase!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Order <strong className="text-slate-900 font-bold">{order.id}</strong> has been received and is now being packaged at our fulfillment hub.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Printer size={14} />
            <span>Print Invoice</span>
          </button>

          <Link
            to="/products"
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Tracking Stepper */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs text-slate-400 font-medium">Tracking Reference</span>
            <h3 className="text-sm font-bold text-slate-900 font-mono">{order.trackingNumber || 'TRK-892109284US'}</h3>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full self-start sm:self-auto">
            Status: {order.status}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-4 pb-2">
          <div className="flex items-center justify-between relative z-10 text-center">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
                ✓
              </div>
              <span className="text-[11px] font-bold text-slate-900 block">Ordered</span>
              <span className="text-[10px] text-slate-400 block">{new Date(order.date).toLocaleDateString()}</span>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
                <Clock size={14} />
              </div>
              <span className="text-[11px] font-bold text-brand-600 block">Processing</span>
              <span className="text-[10px] text-slate-400 block">In Warehouse</span>
            </div>

            <div className="space-y-1 opacity-50">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto text-xs font-bold">
                <Truck size={14} />
              </div>
              <span className="text-[11px] font-bold text-slate-700 block">Shipped</span>
              <span className="text-[10px] text-slate-400 block">Carrier Pickup</span>
            </div>

            <div className="space-y-1 opacity-50">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto text-xs font-bold">
                <Home size={14} />
              </div>
              <span className="text-[11px] font-bold text-slate-700 block">Delivered</span>
              <span className="text-[10px] text-slate-400 block">Expected in 3 days</span>
            </div>
          </div>

          <div className="absolute top-8 left-8 right-8 h-1 bg-slate-100 -z-0">
            <div className="h-full bg-brand-600 w-1/3" />
          </div>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Shipping to */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <MapPin size={13} className="text-brand-600" /> Shipping Destination
          </h4>
          <div className="text-xs text-slate-600 leading-relaxed">
            <p className="font-bold text-slate-900 text-sm">{order.customer?.name}</p>
            <p>{order.customer?.address?.street}</p>
            <p>{order.customer?.address?.city}, {order.customer?.address?.state} {order.customer?.address?.zip}</p>
            <p>{order.customer?.address?.country}</p>
            <p className="mt-2 text-slate-500">Contact: {order.customer?.phone} • {order.customer?.email}</p>
          </div>
        </div>

        {/* Payment and Billing */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-brand-600" /> Payment & Billing
          </h4>
          <div className="text-xs text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-800">Method: {order.paymentMethod}</p>
            <p className="text-slate-500">Billed to: {order.customer?.name}</p>
            <div className="pt-2 border-t border-slate-100 mt-2 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${order.pricing?.subtotal?.toFixed(2)}</span>
              </div>
              {order.pricing?.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount:</span>
                  <span>-${order.pricing?.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{order.pricing?.shipping === 0 ? 'FREE' : `$${order.pricing?.shipping?.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.pricing?.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-slate-100">
                <span>Total Paid:</span>
                <span>${order.pricing?.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Items Ordered ({order.items?.length || 0})</h3>
        <div className="divide-y divide-slate-100">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center gap-4">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-xs text-slate-900 truncate">{item.title}</h5>
                <p className="text-[11px] text-slate-400">
                  Qty: {item.quantity} {item.selectedColor || item.color ? `• Color: ${item.selectedColor || item.color}` : ''}
                </p>
              </div>
              <div className="text-xs font-bold text-slate-900">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
