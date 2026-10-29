import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import RatingStars from '../components/RatingStars';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Check,
  ShieldCheck,
  ArrowUpDown,
  Filter,
  Image as ImageIcon
} from 'lucide-react';

const SAMPLE_IMAGE_PRESETS = [
  { name: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
  { name: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' },
  { name: 'Keyboard', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80' },
  { name: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80' },
  { name: 'Camera/Mic', url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80' },
  { name: 'Desk Lamp', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80' }
];

export const AdminPage = () => {
  const { products, orders, addProduct, updateProduct, deleteProduct, resetProducts, showToast } = useShop();
  const { isAdmin, quickLogin } = useAuth();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form state
  const [formProduct, setFormProduct] = useState({
    title: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    stock: '',
    thumbnail: SAMPLE_IMAGE_PRESETS[0].url,
    description: '',
    badge: '',
    colors: 'Black, Silver',
    features: 'High durability\nBluetooth 5.3\n1-Year warranty'
  });

  const categories = ['All', 'Electronics', 'Audio', 'Wearables', 'Fashion', 'Home & Office'];

  // Calculate Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
  }, [orders]);

  const lowStockCount = useMemo(() => {
    return products.filter(p => p.stock > 0 && p.stock <= 10).length;
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter(p => p.stock <= 0).length;
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Form openers
  const openAddModal = () => {
    setFormProduct({
      title: '',
      category: 'Electronics',
      price: '99.99',
      originalPrice: '129.99',
      stock: '25',
      thumbnail: SAMPLE_IMAGE_PRESETS[0].url,
      description: 'Engineered with precision materials for lasting everyday performance.',
      badge: 'New Arrival',
      colors: 'Space Gray, Silver',
      features: 'Aerospace grade build\nUSB-C fast charging\nMulti-device sync'
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormProduct({
      title: product.title,
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      stock: product.stock.toString(),
      thumbnail: product.thumbnail,
      description: product.description || '',
      badge: product.badge || '',
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      features: Array.isArray(product.features) ? product.features.join('\n') : ''
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formProduct.title.trim() || !formProduct.price) {
      showToast('Validation Error', 'Title and Price are required.', 'error');
      return;
    }

    addProduct({
      title: formProduct.title.trim(),
      category: formProduct.category,
      price: formProduct.price,
      originalPrice: formProduct.originalPrice || formProduct.price,
      stock: formProduct.stock,
      thumbnail: formProduct.thumbnail,
      description: formProduct.description,
      badge: formProduct.badge.trim(),
      colors: formProduct.colors.split(',').map(c => c.trim()).filter(Boolean),
      features: formProduct.features.split('\n').map(f => f.trim()).filter(Boolean),
      isFeatured: true
    });

    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    updateProduct(selectedProduct.id, {
      title: formProduct.title.trim(),
      category: formProduct.category,
      price: formProduct.price,
      originalPrice: formProduct.originalPrice || formProduct.price,
      stock: formProduct.stock,
      thumbnail: formProduct.thumbnail,
      description: formProduct.description,
      badge: formProduct.badge.trim(),
      colors: formProduct.colors.split(',').map(c => c.trim()).filter(Boolean),
      features: formProduct.features.split('\n').map(f => f.trim()).filter(Boolean)
    });

    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Top Banner & Quick Toggle */}
      {!isAdmin && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-900">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
            <span>Currently viewing in customer mode. Click to activate full administrator privileges.</span>
          </div>
          <button
            onClick={() => quickLogin('admin')}
            className="px-3 py-1.5 bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Switch to Admin
          </button>
        </div>
      )}

      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-brand-100 text-brand-700 rounded-xl">
              <ShieldCheck size={20} />
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Product Management Hub</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time catalog control: Add, edit, manage inventory stocks, and monitor placed customer orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={resetProducts}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Reset to default mock catalog"
          >
            <RotateCcw size={14} />
            <span>Reset Default Catalog</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Products</span>
            <Package size={18} className="text-brand-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{products.length}</div>
          <p className="text-[11px] text-emerald-600 font-semibold">Active in Storefront</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Orders</span>
            <TrendingUp size={18} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{orders.length}</div>
          <p className="text-[11px] text-slate-400">Total customer orders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign size={18} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">${totalRevenue.toFixed(2)}</div>
          <p className="text-[11px] text-emerald-600 font-semibold">Processed Sales</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Stock Alerts</span>
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{lowStockCount + outOfStockCount}</div>
          <p className="text-[11px] text-amber-600 font-semibold">{lowStockCount} Low • {outOfStockCount} Out</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200/80 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 relative flex items-center gap-2 ${
            activeTab === 'products' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Catalog Inventory ({filteredProducts.length})</span>
          {activeTab === 'products' && (
            <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-brand-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 relative flex items-center gap-2 ${
            activeTab === 'orders' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Recent Placed Orders ({orders.length})</span>
          {activeTab === 'orders' && (
            <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-brand-600" />
          )}
        </button>
      </div>

      {/* TAB 1: PRODUCTS TABLE */}
      {activeTab === 'products' && (
        <div className="space-y-4 animate-fade-in">
          {/* Table Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Filter by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              />
              <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-semibold">Department:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 text-slate-700 focus:outline-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Inventory</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.thumbnail}
                            alt={prod.title}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0 border border-slate-200/60"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate max-w-xs">{prod.title}</span>
                            <span className="text-[11px] text-slate-400 font-mono">ID: {prod.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
                          {prod.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-900">${prod.price.toFixed(2)}</span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span className="block text-[10px] text-slate-400 line-through">
                            ${prod.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Stock Level */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          prod.stock > 10
                            ? 'bg-emerald-50 text-emerald-700'
                            : prod.stock > 0
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            prod.stock > 10 ? 'bg-emerald-500' : prod.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                          }`} />
                          {prod.stock > 0 ? `${prod.stock} units` : 'Out of Stock'}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-4">
                        <RatingStars rating={prod.rating} size={12} showScore={true} reviewCount={prod.reviewCount} />
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(prod)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECENT ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{order.id}</td>
                    <td className="py-3.5 px-4 text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{order.customer?.name}</span>
                      <span className="text-[11px] text-slate-400">{order.customer?.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      ${order.pricing?.total?.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {order.trackingNumber || 'TRK-DEFAULT'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Catalog Product"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Product Title *</label>
              <input
                type="text"
                value={formProduct.title}
                onChange={(e) => setFormProduct(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Department / Category</label>
              <select
                value={formProduct.category}
                onChange={(e) => setFormProduct(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="Electronics">Electronics</option>
                <option value="Audio">Audio</option>
                <option value="Wearables">Wearables</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Office">Home & Office</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Badge Tag</label>
              <input
                type="text"
                placeholder="e.g. Best Seller, Sale 20%, New"
                value={formProduct.badge}
                onChange={(e) => setFormProduct(prev => ({ ...prev, badge: e.target.value }))}
                className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formProduct.price}
                onChange={(e) => setFormProduct(prev => ({ ...prev, price: e.target.value }))}
                className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Original Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Optional strike-through"
                value={formProduct.originalPrice}
                onChange={(e) => setFormProduct(prev => ({ ...prev, originalPrice: e.target.value }))}
                className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Stock Quantity *</label>
              <input
                type="number"
                value={formProduct.stock}
                onChange={(e) => setFormProduct(prev => ({ ...prev, stock: e.target.value }))}
                className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Colors (comma-separated)</label>
              <input
                type="text"
                value={formProduct.colors}
                onChange={(e) => setFormProduct(prev => ({ ...prev, colors: e.target.value }))}
                className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Preset Images */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Product Image URL</label>
            <input
              type="text"
              value={formProduct.thumbnail}
              onChange={(e) => setFormProduct(prev => ({ ...prev, thumbnail: e.target.value }))}
              className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 mb-2"
            />
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700 flex-shrink-0">Quick Presets:</span>
              {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormProduct(prev => ({ ...prev, thumbnail: preset.url }))}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 rounded-lg flex-shrink-0 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Description</label>
            <textarea
              rows="3"
              value={formProduct.description}
              onChange={(e) => setFormProduct(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Key Features (One per line)</label>
            <textarea
              rows="3"
              value={formProduct.features}
              onChange={(e) => setFormProduct(prev => ({ ...prev, features: e.target.value }))}
              className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-md"
            >
              Create Product
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: EDIT PRODUCT */}
      {selectedProduct && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit "${selectedProduct.title}"`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Product Title *</label>
                <input
                  type="text"
                  value={formProduct.title}
                  onChange={(e) => setFormProduct(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Category</label>
                <select
                  value={formProduct.category}
                  onChange={(e) => setFormProduct(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Audio">Audio</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Office">Home & Office</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={formProduct.badge}
                  onChange={(e) => setFormProduct(prev => ({ ...prev, badge: e.target.value }))}
                  className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formProduct.price}
                  onChange={(e) => setFormProduct(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Original Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formProduct.originalPrice}
                  onChange={(e) => setFormProduct(prev => ({ ...prev, originalPrice: e.target.value }))}
                  className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Stock Level *</label>
                <input
                  type="number"
                  value={formProduct.stock}
                  onChange={(e) => setFormProduct(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Colors</label>
                <input
                  type="text"
                  value={formProduct.colors}
                  onChange={(e) => setFormProduct(prev => ({ ...prev, colors: e.target.value }))}
                  className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Image URL</label>
              <input
                type="text"
                value={formProduct.thumbnail}
                onChange={(e) => setFormProduct(prev => ({ ...prev, thumbnail: e.target.value }))}
                className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows="3"
                value={formProduct.description}
                onChange={(e) => setFormProduct(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Features (One per line)</label>
              <textarea
                rows="3"
                value={formProduct.features}
                onChange={(e) => setFormProduct(prev => ({ ...prev, features: e.target.value }))}
                className="w-full bg-slate-50 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
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
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {selectedProduct && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Product Deletion"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs">
              <AlertTriangle size={20} className="text-rose-600 flex-shrink-0" />
              <span>
                Are you sure you want to delete <strong>{selectedProduct.title}</strong>? This will remove it from the catalog and customer search.
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-md"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminPage;
