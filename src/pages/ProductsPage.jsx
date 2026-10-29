import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import RatingStars from '../components/RatingStars';
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  X,
  RotateCcw,
  Check,
  ShoppingBag,
  ArrowUpDown,
  Filter
} from 'lucide-react';

export const ProductsPage = () => {
  const { products, addToCart } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 600]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync with URL params
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Unique categories
  const categoriesList = useMemo(() => {
    const cats = ['All', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  // Max price among products
  const maxProductPrice = useMemo(() => {
    return Math.ceil(Math.max(...products.map(p => p.price), 500));
  }, [products]);

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter(item => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchCat && !matchDesc) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }

        // Price range
        if (item.price < priceRange[0] || item.price > priceRange[1]) {
          return false;
        }

        // Rating
        if (minRating > 0 && item.rating < minRating) {
          return false;
        }

        // In-stock
        if (inStockOnly && item.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        return 0; // 'featured'
      });
  }, [products, searchQuery, selectedCategory, priceRange, minRating, inStockOnly, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceRange([0, maxProductPrice]);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    priceRange[0] > 0 ||
    priceRange[1] < maxProductPrice ||
    minRating > 0 ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Page Title & Breadcrumbs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Catalog</span>
          {selectedCategory !== 'All' && (
            <>
              <span>/</span>
              <span className="text-brand-600 font-medium">{selectedCategory}</span>
            </>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Collection`}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing {filteredProducts.length} of {products.length} total items
            </p>
          </div>

          {/* Search bar inside Catalog */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search in catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-9 pr-8 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 shadow-soft-sm"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-brand-600" />
              <span>Filters</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <RotateCcw size={12} /> Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Department
            </h4>
            <div className="space-y-1">
              {categoriesList.map(cat => {
                const isSelected = selectedCategory === cat;
                const count = cat === 'All'
                  ? products.length
                  : products.filter(p => p.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isSelected ? 'bg-brand-200 text-brand-900' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Price Range
            </h4>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max={maxProductPrice}
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>${priceRange[0]}</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md text-brand-700">
                  Up to ${priceRange[1]}
                </span>
              </div>
            </div>
          </div>

          {/* Minimum Rating Filter */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Minimum Rating
            </h4>
            <div className="space-y-1.5">
              {[4.8, 4.5, 4.0, 0].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(stars)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                    minRating === stars
                      ? 'bg-brand-50 text-brand-800 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {stars === 0 ? (
                      <span>All Ratings</span>
                    ) : (
                      <>
                        <RatingStars rating={stars} size={13} />
                        <span>{stars} & Up</span>
                      </>
                    )}
                  </div>
                  {minRating === stars && <Check size={14} className="text-brand-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock Toggle */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">In Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 accent-brand-600 cursor-pointer"
              />
            </label>
          </div>
        </aside>

        {/* Product Catalog Display Area */}
        <div className="lg:col-span-3 space-y-5">
          {/* Controls Bar: Sort & View Toggle */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-soft-sm flex flex-wrap items-center justify-between gap-3">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
            >
              <Filter size={14} />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            {/* Active Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs flex-1">
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg font-medium">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}><X size={12} /></button>
                </span>
              )}
              {priceRange[1] < maxProductPrice && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg font-medium">
                  Under ${priceRange[1]}
                  <button onClick={() => setPriceRange([0, maxProductPrice])}><X size={12} /></button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg font-medium">
                  ★ {minRating}+
                  <button onClick={() => setMinRating(0)}><X size={12} /></button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg font-medium">
                  In Stock
                  <button onClick={() => setInStockOnly(false)}><X size={12} /></button>
                </span>
              )}
            </div>

            {/* Sort & Grid/List view controls */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <ArrowUpDown size={14} className="text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer text-xs pr-1"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Grid View"
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Items */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center mx-auto">
                <Search size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any products matching your specific filters. Try expanding your search terms or resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-soft-sm hover:shadow-soft transition-all flex flex-col sm:flex-row gap-5 items-center group"
                >
                  <Link to={`/product/${product.id}`} className="w-full sm:w-44 aspect-square rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      {product.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/product/${product.id}`}
                      className="text-base font-bold text-slate-900 hover:text-brand-600 transition-colors block"
                    >
                      {product.title}
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <RatingStars
                      rating={product.rating}
                      showScore={true}
                      reviewCount={product.reviewCount}
                      size={13}
                    />
                  </div>

                  <div className="w-full sm:w-48 sm:border-l sm:border-slate-100 sm:pl-5 flex flex-col justify-between items-start sm:items-end gap-3 flex-shrink-0">
                    <div>
                      <div className="text-xl font-extrabold text-slate-900">
                        ${product.price.toFixed(2)}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-xs text-slate-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </div>
                      )}
                      <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                        {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product, 1)}
                      disabled={product.stock <= 0}
                      className="w-full sm:w-auto px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      <ShoppingBag size={14} />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 animate-slide-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Category</h4>
              <div className="space-y-1">
                {categoriesList.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                      selectedCategory === cat ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile In Stock */}
            <div>
              <label className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 accent-brand-600"
                />
              </label>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-brand-600 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
