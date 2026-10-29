import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import {
  User,
  Package,
  Heart,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Printer,
  Edit3,
  LogOut,
  ShoppingBag,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';

  const { user, updateProfile, logout, isAdmin } = useAuth();
  const { orders, wishlist, products, addToCart, removeFromCart, showToast } = useShop();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Edit profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || ''
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zip: user.address?.zip || '',
        country: user.address?.country || ''
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800">Please Sign In</h2>
        <p className="text-xs text-slate-500 mt-2">You need to be signed in to view your profile and order history.</p>
        <Link
          to="/login"
          className="mt-5 inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-semibold"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  // Wishlist products
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({
      name: profileForm.name,
      phone: profileForm.phone,
      address: {
        street: profileForm.street,
        city: profileForm.city,
        state: profileForm.state,
        zip: profileForm.zip,
        country: profileForm.country
      }
    });
    setIsEditModalOpen(false);
    showToast('Profile Saved', 'Your personal and shipping details were updated.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-brand-50 text-brand-700'
              }`}>
                {isAdmin ? '🛡️ Administrator' : 'Verified Member'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{user.email} • {user.phone}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Member since {user.memberSince || '2024'} • {orders.length} orders completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Edit3 size={14} />
            <span>Edit Profile</span>
          </button>

          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            >
              <ShieldCheck size={14} />
              <span>Admin Management</span>
            </Link>
          )}

          <button
            onClick={logout}
            className="p-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200/80 gap-6 text-sm font-semibold">
        <button
          onClick={() => {
            setActiveTab('orders');
            setSearchParams({ tab: 'orders' });
          }}
          className={`pb-3 relative flex items-center gap-2 transition-colors ${
            activeTab === 'orders' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package size={16} />
          <span>Order History ({orders.length})</span>
          {activeTab === 'orders' && (
            <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-brand-600" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('wishlist');
            setSearchParams({ tab: 'wishlist' });
          }}
          className={`pb-3 relative flex items-center gap-2 transition-colors ${
            activeTab === 'wishlist' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart size={16} />
          <span>Saved Wishlist ({wishlist.length})</span>
          {activeTab === 'wishlist' && (
            <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-brand-600" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('address');
            setSearchParams({ tab: 'address' });
          }}
          className={`pb-3 relative flex items-center gap-2 transition-colors ${
            activeTab === 'address' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <MapPin size={16} />
          <span>Default Address</span>
          {activeTab === 'address' && (
            <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-brand-600" />
          )}
        </button>
      </div>

      {/* TAB CONTENT: ORDER HISTORY */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-fade-in">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
              <Package size={36} className="mx-auto text-slate-300" />
              <h3 className="font-bold text-slate-800 text-sm">No orders placed yet</h3>
              <p className="text-xs text-slate-400">Items you purchase will appear here with instant tracking.</p>
              <Link to="/products" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold">
                Explore Catalog
              </Link>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft-sm hover:shadow-soft transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-slate-900 font-mono text-sm">{order.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">
                      {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-slate-900">
                      ${order.pricing?.total?.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700'
                        : order.status === 'Processing'
                        ? 'bg-brand-50 text-brand-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {order.status}
                    </span>

                    <button
                      onClick={() => setSelectedOrderDetails(order)}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                    >
                      <span>Order Details</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h6 className="text-xs font-semibold text-slate-900 truncate">{item.title}</h6>
                        <span className="text-[11px] text-slate-400">Qty: {item.quantity} • ${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="animate-fade-in">
          {wishlistProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
              <Heart size={36} className="mx-auto text-slate-300" />
              <h3 className="font-bold text-slate-800 text-sm">Your wishlist is empty</h3>
              <p className="text-xs text-slate-400">Tap the heart icon on any product to save it here for later.</p>
              <Link to="/products" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold">
                Find Items to Save
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SAVED ADDRESS */}
      {activeTab === 'address' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft-sm space-y-4 max-w-xl animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin size={16} className="text-brand-600" />
              <span>Default Shipping Address</span>
            </h3>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              Update
            </button>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed space-y-1">
            <p className="font-bold text-slate-900 text-sm">{user.name}</p>
            <p>{user.address?.street}</p>
            <p>{user.address?.city}, {user.address?.state} {user.address?.zip}</p>
            <p>{user.address?.country}</p>
            <p className="pt-2 text-slate-400">Contact Phone: {user.phone}</p>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Personal & Delivery Info"
      >
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              value={profileForm.phone}
              onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-3">Default Shipping Address</h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Street</label>
                <input
                  type="text"
                  value={profileForm.street}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, street: e.target.value }))}
                  className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">State</label>
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">ZIP</label>
                  <input
                    type="text"
                    value={profileForm.zip}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, zip: e.target.value }))}
                    className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Country</label>
                <input
                  type="text"
                  value={profileForm.country}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* View Order Details Modal */}
      {selectedOrderDetails && (
        <Modal
          isOpen={!!selectedOrderDetails}
          onClose={() => setSelectedOrderDetails(null)}
          title={`Order #${selectedOrderDetails.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="text-slate-400">Order Placed</span>
                <p className="font-bold text-slate-900">{new Date(selectedOrderDetails.date).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-400">Status</span>
                <p className="font-bold text-brand-600">{selectedOrderDetails.status}</p>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 mb-2">Items Breakdown</h5>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {selectedOrderDetails.items?.map((item, i) => (
                  <div key={i} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.thumbnail} alt={item.title} className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <p className="font-semibold text-slate-900 truncate max-w-xs">{item.title}</p>
                        <p className="text-slate-400 text-[11px]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${selectedOrderDetails.pricing?.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${selectedOrderDetails.pricing?.shipping?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-slate-100">
                <span>Grand Total:</span>
                <span>${selectedOrderDetails.pricing?.total?.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProfilePage;
