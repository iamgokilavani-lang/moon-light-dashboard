import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Mail,
  ArrowRight,
  Heart,
  Moon
} from 'lucide-react';

export const Footer = () => {
  const { showToast } = useShop();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Invalid Email', 'Please provide a valid email address.', 'error');
      return;
    }
    showToast('Subscribed!', 'Welcome to Moon Light Store Club. Check your inbox for $15 welcome credit.');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      {/* Brand Value Propositions */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Free Global Delivery</h4>
                <p className="text-xs text-slate-400 mt-0.5">On all eligible orders over $100</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">256-Bit Encrypted</h4>
                <p className="text-xs text-slate-400 mt-0.5">Bank-grade checkout security</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">30-Day Easy Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">No questions asked return policy</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">24/7 Expert Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Dedicated concierge assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 via-indigo-600 to-amber-400 flex items-center justify-center text-white shadow-md">
                <Moon className="w-5 h-5 fill-amber-200 text-amber-200" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Moon Light <span className="text-brand-400">Store</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Moon Light Store is a modern frontend e-commerce system featuring an ultra-smooth shopping cart, smart inventory management, real-time filters, and complete order history persistence.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p>📍 100 Innovation Way, Suite 400, San Francisco, CA</p>
              <p>📞 +1 (800) 555-MOON (Mon-Fri 9am-6pm PST)</p>
              <p>✉️ concierge@moonlightstore.example.com</p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/products?category=Electronics" className="hover:text-white transition-colors">Electronics & Gadgets</Link>
              </li>
              <li>
                <Link to="/products?category=Audio" className="hover:text-white transition-colors">Studio Audio & Speakers</Link>
              </li>
              <li>
                <Link to="/products?category=Wearables" className="hover:text-white transition-colors">Smart Wearables</Link>
              </li>
              <li>
                <Link to="/products?category=Fashion" className="hover:text-white transition-colors">Fashion & Leather</Link>
              </li>
              <li>
                <Link to="/products?category=Home & Office" className="hover:text-white transition-colors">Workspace & Smart Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">All Featured Products</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/profile?tab=orders" className="hover:text-white transition-colors">Track Order</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">Shopping Bag</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">My Profile</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-brand-400 font-medium transition-colors">Admin Management</Link>
              </li>
              <li>
                <span className="text-slate-500">Shipping Policies</span>
              </li>
              <li>
                <span className="text-slate-500">Privacy & Terms</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Get 20% Off Code
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Subscribe to unlock flash sale alerts, VIP drops, and weekly product releases.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 text-white placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Subscribe</span>
                <ArrowRight size={13} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © {new Date().getFullYear()} Moon Light Store Systems, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">VISA</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">MC</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">AMEX</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">PAYPAL</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
