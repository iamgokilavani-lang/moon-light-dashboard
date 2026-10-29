import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus, Sparkles } from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    freeShipping
  } = useShop();

  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-left">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
              <span className="px-2 py-0.5 text-xs font-semibold bg-brand-50 text-brand-700 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {freeShipping ? (
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <Sparkles size={13} /> You've unlocked Free Express Shipping!
                </span>
              ) : (
                <span className="text-slate-600">
                  Add <strong className="text-brand-600 font-bold">${amountNeeded.toFixed(2)}</strong> more for <strong className="text-slate-900">Free Shipping</strong>
                </span>
              )}
              <span className="text-slate-400 font-medium">
                {Math.round(progressToFreeShipping)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  freeShipping ? 'bg-emerald-500' : 'bg-brand-600'
                }`}
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-800">Your bag is empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Looks like you haven't added anything to your cart yet. Explore our featured products!
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/products');
                  }}
                  className="mt-5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all hover:shadow-brand-500/25"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-start">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-100 flex-shrink-0 bg-slate-50"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.productId}`}
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="text-sm font-semibold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    {item.selectedColor && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Color: <span className="text-slate-600 font-medium">{item.selectedColor}</span>
                      </p>
                    )}
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1 hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors"
                          title="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-white shadow-soft">
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold text-slate-900 text-base">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Taxes and shipping calculated at checkout.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs text-center hover:bg-slate-50 transition-colors flex items-center justify-center"
                >
                  View Full Cart
                </Link>
                <button
                  onClick={handleCheckout}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-1.5"
                >
                  Checkout
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
