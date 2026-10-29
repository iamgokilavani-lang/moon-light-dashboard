import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping: defaultShipping,
    cartTax,
    cartTotal,
    appliedCoupon,
    freeShipping,
    createOrder,
    showToast
  } = useShop();

  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.name ? user.name.split(' ')[0] : 'Gokilavani',
    lastName: user?.name && user.name.split(' ').length > 1 ? user.name.split(' ')[1] : '',
    email: user?.email || 'gokilavani@example.com',
    phone: user?.phone || '+91 98765 43210',
    street: user?.address?.street || '742 Lotus Boulevard, Indiranagar',
    city: user?.address?.city || 'Bengaluru',
    state: user?.address?.state || 'Karnataka',
    zip: user?.address?.zip || '560038',
    country: user?.address?.country || 'India',
    shippingMethod: 'standard', // 'standard' | 'express' | 'overnight'
    paymentMethod: 'card', // 'card' | 'paypal' | 'cod'
    cardNumber: '4242 •••• •••• 4242',
    cardName: user?.name || 'Gokilavani',
    cardExpiry: '12/28',
    cardCvv: '888'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Your bag is empty</h2>
        <p className="text-xs text-slate-500 mt-1">Please add items to your shopping bag before checking out.</p>
        <Link
          to="/products"
          className="mt-5 inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-semibold"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // Shipping calculation based on method
  let shippingCost = freeShipping ? 0 : defaultShipping;
  if (formData.shippingMethod === 'express') {
    shippingCost += 14.99;
  } else if (formData.shippingMethod === 'overnight') {
    shippingCost += 24.99;
  }

  const finalTotal = Math.max(0, cartSubtotal - cartDiscount + shippingCost + cartTax);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAutofillDemo = () => {
    setFormData({
      firstName: 'Gokilavani',
      lastName: '',
      email: 'gokilavani@moonlightstore.example.com',
      phone: '+91 98765 43210',
      street: '742 Lotus Boulevard, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      zip: '560038',
      country: 'India',
      shippingMethod: 'standard',
      paymentMethod: 'card',
      cardNumber: '4532 8920 4410 8821',
      cardName: 'Gokilavani',
      cardExpiry: '08/29',
      cardCvv: '742'
    });
    setErrors({});
    showToast('Demo Details Filled', 'Prefilled verified address & payment information.');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required';

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim() || formData.cardNumber.length < 12) newErrors.cardNumber = 'Valid 16-digit card required';
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'MM/YY required';
      if (!formData.cardCvv.trim() || formData.cardCvv.length < 3) newErrors.cardCvv = '3-digit CVV required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Form Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Create real order in ShopContext
      const order = createOrder({
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country
          }
        },
        shippingMethod: formData.shippingMethod,
        paymentMethod: formData.paymentMethod === 'card'
          ? `Card ending in ${formData.cardNumber.slice(-4).replace(/\s/g, '') || '4242'}`
          : formData.paymentMethod === 'paypal' ? 'PayPal Checkout' : 'Cash on Delivery',
        items: [...cart],
        pricing: {
          subtotal: cartSubtotal,
          discount: cartDiscount,
          shipping: shippingCost,
          tax: cartTax,
          total: finalTotal
        }
      });

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }

      showToast('Order Placed!', `Order #${order.id} confirmed.`);
      setIsSubmitting(false);
      navigate(`/order-success/${order.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Title & Quick Demo Fill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/cart" className="hover:text-brand-600 transition-colors flex items-center gap-1">
              <ArrowLeft size={12} /> Back to Bag
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-xs text-slate-500 mt-0.5">Please provide shipping address and payment method.</p>
        </div>

        <button
          onClick={handleAutofillDemo}
          type="button"
          className="self-start sm:self-auto px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-brand-200"
        >
          <Sparkles size={14} />
          <span>Quick Autofill Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Step 1: Customer Information */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Contact Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border ${errors.firstName ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} focus:outline-none focus:border-brand-500`}
                />
                {errors.firstName && <p className="text-[10px] text-rose-500 mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border ${errors.lastName ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} focus:outline-none focus:border-brand-500`}
                />
                {errors.lastName && <p className="text-[10px] text-rose-500 mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border ${errors.email ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} focus:outline-none focus:border-brand-500`}
                />
                {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border ${errors.phone ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} focus:outline-none focus:border-brand-500`}
                />
                {errors.phone && <p className="text-[10px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Delivery Address</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  placeholder="Street name and house/apt number"
                  value={formData.street}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border ${errors.street ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} focus:outline-none focus:border-brand-500`}
                />
                {errors.street && <p className="text-[10px] text-rose-500 mt-1">{errors.street}</p>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border ${errors.city ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} focus:outline-none focus:border-brand-500`}
                  />
                  {errors.city && <p className="text-[10px] text-rose-500 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">State / Prov *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border ${errors.state ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} focus:outline-none focus:border-brand-500`}
                  />
                  {errors.state && <p className="text-[10px] text-rose-500 mt-1">{errors.state}</p>}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">ZIP / Postal *</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border ${errors.zip ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} focus:outline-none focus:border-brand-500`}
                  />
                  {errors.zip && <p className="text-[10px] text-rose-500 mt-1">{errors.zip}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Shipping Method */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>Shipping Options</span>
            </div>

            <div className="space-y-2.5">
              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formData.shippingMethod === 'standard'
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={formData.shippingMethod === 'standard'}
                    onChange={handleInputChange}
                    className="text-brand-600 accent-brand-600"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Standard Delivery (3-5 Business Days)</span>
                    <span className="block text-[11px] text-slate-500">Tracked ground delivery</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {freeShipping ? 'FREE' : `$${defaultShipping.toFixed(2)}`}
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formData.shippingMethod === 'express'
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={formData.shippingMethod === 'express'}
                    onChange={handleInputChange}
                    className="text-brand-600 accent-brand-600"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Express Priority (1-2 Business Days)</span>
                    <span className="block text-[11px] text-slate-500">Expedited air with priority packing</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">+$14.99</span>
              </label>

              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formData.shippingMethod === 'overnight'
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="overnight"
                    checked={formData.shippingMethod === 'overnight'}
                    onChange={handleInputChange}
                    className="text-brand-600 accent-brand-600"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Overnight Next-Morning Delivery</span>
                    <span className="block text-[11px] text-slate-500">Guaranteed delivery by 10:30 AM</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">+$24.99</span>
              </label>
            </div>
          </div>

          {/* Step 4: Payment Method */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">4</span>
              <span>Payment Details</span>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                  formData.paymentMethod === 'card'
                    ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard size={18} />
                <span>Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'paypal' }))}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                  formData.paymentMethod === 'paypal'
                    ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="font-extrabold text-blue-600 text-sm">PayPal</span>
                <span>Express</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                  formData.paymentMethod === 'cod'
                    ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building size={18} />
                <span>Pay on Delivery</span>
              </button>
            </div>

            {/* Credit Card Inputs */}
            {formData.paymentMethod === 'card' && (
              <div className="space-y-3.5 pt-2 animate-fade-in">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Name on Card *</label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border font-mono ${errors.cardNumber ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} focus:outline-none focus:border-brand-500`}
                  />
                  {errors.cardNumber && <p className="text-[10px] text-rose-500 mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Expires (MM/YY) *</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      className={`w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border font-mono ${errors.cardExpiry ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} focus:outline-none focus:border-brand-500`}
                    />
                    {errors.cardExpiry && <p className="text-[10px] text-rose-500 mt-1">{errors.cardExpiry}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Security Code (CVV) *</label>
                    <input
                      type="password"
                      name="cardCvv"
                      placeholder="CVV"
                      maxLength={4}
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      className={`w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border font-mono ${errors.cardCvv ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} focus:outline-none focus:border-brand-500`}
                    />
                    {errors.cardCvv && <p className="text-[10px] text-rose-500 mt-1">{errors.cardCvv}</p>}
                  </div>
                </div>
              </div>
            )}

            {formData.paymentMethod === 'paypal' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 animate-fade-in">
                You will be connected to secure PayPal checkout to finalize payment upon placing order.
              </div>
            )}

            {formData.paymentMethod === 'cod' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 animate-fade-in">
                Pay in cash or debit card when your delivery arrives at your door.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary Preview & Submit */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft-sm space-y-5">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Order Summary ({cart.length})</span>
              <Link to="/cart" className="text-xs text-brand-600 hover:text-brand-700 font-semibold">
                Edit Bag
              </Link>
            </h3>

            {/* Cart Items Preview */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
              {cart.map(item => (
                <div key={item.id} className="py-2.5 flex items-center gap-3">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-slate-800 truncate">{item.title}</h5>
                    <p className="text-[11px] text-slate-400">
                      Qty: {item.quantity} {item.selectedColor && `• ${item.selectedColor}`}
                    </p>
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculation details */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">${cartSubtotal.toFixed(2)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>Coupon Savings</span>
                  <span>-${cartDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Shipping ({formData.shippingMethod})</span>
                <span className="font-semibold text-slate-800">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-semibold text-slate-800">${cartTax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-base">
                <span className="font-extrabold text-slate-900">Total Due</span>
                <span className="font-extrabold text-brand-600 text-xl">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              <Lock size={15} />
              <span>{isSubmitting ? 'Processing Payment...' : `Authorize & Pay $${finalTotal.toFixed(2)}`}</span>
            </button>

            <div className="text-center text-[11px] text-slate-400 pt-1">
              By placing your order, you agree to Moon Light Store's Terms of Sale and Privacy Notice.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
