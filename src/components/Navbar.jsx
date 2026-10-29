import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  ShieldCheck,
  Package,
  LogOut,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Moon
} from 'lucide-react';

export const Navbar = () => {
  const { cartCount, wishlist, setIsCartDrawerOpen, products } = useShop();
  const { user, isAdmin, logout, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Live matching products for quick search popup
  const searchResults = searchQuery.trim()
    ? products
        .filter(p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Promotional Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 font-medium flex items-center justify-between border-b border-slate-800">
        <div className="hidden sm:flex items-center gap-2">
          <span className="flex items-center gap-1 text-amber-400">
            <Sparkles size={12} /> FLASH PROMO
          </span>
          <span>Use code <strong className="text-white font-bold tracking-wide">MOON20</strong> for 20% off orders over $100</span>
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 text-xs mx-auto sm:mx-0">
          <span className="text-slate-400">🚚 Free express shipping on all orders over $100</span>
          <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
            <span className="text-slate-400 text-[11px]">Role:</span>
            <button
              onClick={() => quickLogin(isAdmin ? 'customer' : 'admin')}
              className="text-[11px] font-semibold text-brand-300 hover:text-white transition-colors bg-slate-800 px-2 py-0.5 rounded"
              title="Click to toggle demo role"
            >
              {isAdmin ? '🛡️ Admin Mode' : '👤 Customer Mode'} (Switch)
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="glass border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Moon className="w-5 h-5 fill-amber-200 text-amber-200" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                Moon Light <span className="text-brand-600">Store</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-semibold tracking-widest uppercase -mt-1">
                Luminous Essentials
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/" className={`hover:text-brand-600 transition-colors ${location.pathname === '/' ? 'text-brand-600 font-semibold' : ''}`}>
              Home
            </Link>
            <Link to="/products" className={`hover:text-brand-600 transition-colors ${location.pathname === '/products' && !location.search ? 'text-brand-600 font-semibold' : ''}`}>
              All Products
            </Link>
            <Link to="/products?category=Electronics" className="hover:text-brand-600 transition-colors">
              Electronics
            </Link>
            <Link to="/products?category=Audio" className="hover:text-brand-600 transition-colors">
              Audio
            </Link>
            <Link to="/products?category=Fashion" className="hover:text-brand-600 transition-colors">
              Fashion
            </Link>
            <Link to="/products?category=Home & Office" className="hover:text-brand-600 transition-colors">
              Home & Office
            </Link>
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-1 text-brand-600 font-semibold bg-brand-50 px-2.5 py-1 rounded-lg hover:bg-brand-100 transition-colors">
                <ShieldCheck size={14} /> Admin Hub
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full bg-slate-100/80 focus:bg-white pl-10 pr-4 py-2 rounded-xl text-sm border border-transparent focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all text-slate-800 placeholder-slate-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </form>

            {/* Live Search Quick Results Popup */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-soft-lg border border-slate-100 p-2 z-50 animate-slide-up">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                  Suggestions
                </div>
                <div className="divide-y divide-slate-50">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      onClick={() => setIsSearchFocused(false)}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors group"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.category} • <strong className="text-slate-700">${item.price.toFixed(2)}</strong>
                        </div>
                      </div>
                      <ArrowRight size={13} className="text-slate-300 group-hover:text-brand-600" />
                    </Link>
                  ))}
                </div>
                <button
                  onClick={handleSearchSubmit}
                  className="w-full mt-2 text-center py-2 text-xs font-semibold text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                >
                  View all results for "{searchQuery}"
                </button>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            
            {/* Wishlist */}
            <Link
              to="/profile?tab=wishlist"
              className="relative p-2.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2"
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-subtle">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            <div ref={userMenuRef} className="relative">
              {user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-500/20"
                  />
                  <span className="hidden sm:inline text-xs font-semibold text-slate-700 max-w-[90px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  Sign In
                </Link>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-slate-100 py-2 z-50 animate-slide-up">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                      isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-brand-50 text-brand-700'
                    }`}>
                      {isAdmin ? 'Store Admin' : 'Customer'}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User size={15} className="text-slate-400" /> My Profile
                    </Link>
                    <Link
                      to="/profile?tab=orders"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Package size={15} className="text-slate-400" /> Order History
                    </Link>
                    <Link
                      to="/profile?tab=wishlist"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Heart size={15} className="text-slate-400" /> Saved Items
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        <ShieldCheck size={15} /> Admin Product Manager
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-slide-up shadow-lg">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium text-slate-700 pt-2">
            <Link to="/" className="p-2.5 rounded-lg hover:bg-slate-50">Home</Link>
            <Link to="/products" className="p-2.5 rounded-lg hover:bg-slate-50">All Products</Link>
            <Link to="/products?category=Electronics" className="p-2.5 rounded-lg hover:bg-slate-50">Electronics</Link>
            <Link to="/products?category=Audio" className="p-2.5 rounded-lg hover:bg-slate-50">Audio</Link>
            <Link to="/products?category=Fashion" className="p-2.5 rounded-lg hover:bg-slate-50">Fashion</Link>
            <Link to="/products?category=Home & Office" className="p-2.5 rounded-lg hover:bg-slate-50">Home & Office</Link>
            <Link to="/cart" className="p-2.5 rounded-lg hover:bg-slate-50">Shopping Cart</Link>
            <Link to="/profile" className="p-2.5 rounded-lg hover:bg-slate-50">My Account</Link>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="block w-full py-2.5 px-4 bg-brand-50 text-brand-700 font-semibold text-center rounded-xl text-sm"
            >
              🛡️ Open Admin Product Manager
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
