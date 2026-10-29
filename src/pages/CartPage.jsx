import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  X,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Truck
} from 'lucide-react';

export const CartPage = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShipping
  } = useShop();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft-sm">
          <ShoppingBag size={36} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your Bag is Empty</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-md mx-auto">
          Explore our trending headphones, ergonomic setups, smart wearables, and leather essentials.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/25 transition-all"
        >
          <span>Start Exploring</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Bag</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your selected items before proceeding to secure checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 self-start sm:self-auto flex items-center gap-1.5"
        >
          <Trash2 size={13} />
          <span>Clear Entire Bag</span>
        </button>
      </div>

      {/* Free Shipping Alert Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft-sm">
        <div className="flex items-center justify-between text-xs mb-2">
          {freeShipping ? (
            <span className="font-bold text-emerald-600 flex items-center gap-1.5">
              <Sparkles size={15} /> Free Express Shipping Unlocked!
            </span>
          ) : (
            <span className="text-slate-700">
              Add <strong className="text-brand-600">${amountNeeded.toFixed(2)}</strong> more to get <strong className="text-slate-900">Free Express Shipping</strong>
            </span>
          )}
          <span className="text-slate-400 font-semibold">{Math.round(progressToFreeShipping)}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              freeShipping ? 'bg-emerald-500' : 'bg-brand-600'
            }`}
            style={{ width: `${progressToFreeShipping}%` }}
          />
        </div>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm divide-y divide-slate-100 overflow-hidden">
          {cart.map((item) => (
            <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <Link to={`/product/${item.productId}`} className="w-24 h-24 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.productId}`}
                  className="font-bold text-sm text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                >
                  {item.title}
                </Link>
                {item.selectedColor && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Color: <span className="text-slate-700 font-medium">{item.selectedColor}</span>
                  </p>
                )}
                <div className="text-sm font-extrabold text-slate-900 mt-1">
                  ${item.price.toFixed(2)}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-inner">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="Decrease"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors"
                    title="Increase"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Total for this line */}
                <div className="text-right min-w-[70px]">
                  <span className="block text-xs text-slate-400">Total</span>
                  <span className="block font-bold text-sm text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove from bag"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <div className="p-4 bg-slate-50 flex items-center justify-between">
            <Link
              to="/products"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Continue Shopping</span>
            </Link>
            <span className="text-xs text-slate-500 font-medium">
              {cart.reduce((s, i) => s + i.quantity, 0)} Items in Bag
            </span>
          </div>
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h2>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800">${cartSubtotal.toFixed(2)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-${cartDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <span>Shipping Estimate</span>
                  {freeShipping && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">FREE</span>
                  )}
                </span>
                <span className="font-semibold text-slate-800">
                  {cartShipping === 0 ? '$0.00' : `$${cartShipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-800">${cartTax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-base">
                <span className="font-extrabold text-slate-900">Total</span>
                <span className="font-extrabold text-slate-900 text-lg">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-2 border-t border-slate-100">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Tag size={15} className="text-emerald-600" />
                    <div>
                      <strong className="text-emerald-800 uppercase font-bold">{appliedCoupon.code}</strong>
                      <p className="text-[11px] text-emerald-600">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-emerald-700 hover:text-rose-600 rounded"
                    title="Remove coupon"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Promo Code (Try: MOON20 or SAVE10)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError('');
                      }}
                      className="flex-1 bg-slate-50 uppercase px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={15} />
            </button>

            {/* Guarantees */}
            <div className="pt-2 text-center text-[11px] text-slate-400 space-y-1">
              <p className="flex items-center justify-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-500" /> 256-Bit SSL Encrypted Checkout
              </p>
              <p className="flex items-center justify-center gap-1.5">
                <Truck size={13} className="text-brand-500" /> Orders ship within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
