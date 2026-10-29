import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  Plus,
  Minus,
  Zap,
  Share2,
  ChevronRight,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getProductById,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addReview,
    showToast
  } = useShop();

  const product = getProductById(id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('features');

  // Review Form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) {
      setActiveImageIndex(0);
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : '');
      setQuantity(1);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 text-xs mt-2">The product you are looking for may have been removed or does not exist.</p>
        <Link
          to="/products"
          className="mt-6 inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const gallery = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const isOutOfStock = product.stock <= 0;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Product link copied to your clipboard!');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Review Required', 'Please provide review remarks.', 'error');
      return;
    }
    setReviewSubmitting(true);
    addReview(product.id, {
      author: reviewAuthor.trim() || 'Verified Shopper',
      rating: reviewRating,
      comment: reviewComment.trim()
    });
    setReviewAuthor('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-14">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <ChevronRight size={13} />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-600 transition-colors">
          {product.category}
        </Link>
        <ChevronRight size={13} />
        <span className="text-slate-700 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-soft-sm group">
            <img
              src={gallery[activeImageIndex] || product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-slate-900/90 backdrop-blur-sm text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md">
                {product.badge}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 px-2.5 py-1 bg-rose-500 text-white font-bold text-xs rounded-full shadow-md">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-brand-600 ring-2 ring-brand-500/20 scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Actions & Specs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-brand-600">
                {product.category}
              </span>
              <button
                onClick={handleShare}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                title="Share product link"
              >
                <Share2 size={16} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.title}
            </h1>

            {/* Ratings and Reviews count */}
            <div className="flex items-center gap-3 pt-1">
              <RatingStars
                rating={product.rating}
                size={16}
                showScore={true}
                reviewCount={product.reviewCount}
              />
              <span className="text-slate-300">|</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle size={13} /> In Stock ({product.stock} units)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-base text-slate-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Color variant selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700">
                Selected Color: <strong className="text-brand-600">{selectedColor}</strong>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedColor === color
                        ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-700">Quantity</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Decrease"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-bold text-xs text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30"
                  title="Increase"
                >
                  <Plus size={14} />
                </button>
              </div>

              <span className="text-xs text-slate-400">
                Max {product.stock} units
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-40"
              >
                <ShoppingBag size={16} />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition-all shadow-sm ${
                  isFavorited
                    ? 'border-rose-200 bg-rose-50 text-rose-500 ring-2 ring-rose-200'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-500'
                }`}
                title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={18} className={isFavorited ? 'fill-rose-500' : ''} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-3.5 px-6 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-40"
            >
              <Zap size={16} className="text-amber-400 fill-amber-400" />
              <span>Instant Buy Now</span>
            </button>
          </div>

          {/* Buyer Protection Perks */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-500">
            <div className="flex items-center gap-2.5">
              <Truck size={15} className="text-brand-600 flex-shrink-0" />
              <span>Free express shipping on this item today</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw size={15} className="text-brand-600 flex-shrink-0" />
              <span>30-day hassle-free return guarantee</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={15} className="text-brand-600 flex-shrink-0" />
              <span>1-Year manufacturer warranty included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Customer Reviews */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-soft-sm">
        <div className="flex items-center gap-6 border-b border-slate-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('features')}
            className={`text-sm font-bold pb-2 relative transition-colors ${
              activeTab === 'features' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Product Features
            {activeTab === 'features' && (
              <span className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-brand-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-sm font-bold pb-2 relative transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-full">
              {product.reviews?.length || 0}
            </span>
            {activeTab === 'reviews' && (
              <span className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-brand-600" />
            )}
          </button>
        </div>

        {/* Tab 1: Key Features */}
        {activeTab === 'features' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900">Key Highlights</h3>
            {product.features && product.features.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <CheckCircle size={16} className="text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">Standard premium build with comprehensive manufacturer specifications.</p>
            )}

            <div className="pt-4">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Shipping & Packaging</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Shipped in 100% recyclable, shock-absorbing protective retail packaging with included user guides, cables, and warranty card.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Customer Reviews & Write Review Form */}
        {activeTab === 'reviews' && (
          <div className="space-y-10 animate-fade-in">
            {/* Review Form */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <MessageSquare size={16} className="text-brand-600" /> Write a Customer Review
              </h3>
              <p className="text-xs text-slate-500 mb-4">Share your honest feedback with other shoppers.</p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Your Rating</label>
                    <RatingStars
                      rating={reviewRating}
                      interactive={true}
                      onRatingChange={setReviewRating}
                      size={20}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Gokilavani or Priya Patel"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="w-full bg-white px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Your Experience</label>
                  <textarea
                    rows="3"
                    placeholder="Tell us what you loved about this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
                >
                  Post Review
                </button>
              </form>
            </div>

            {/* Existing Reviews List */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Verified Reviews ({product.reviews?.length || 0})
              </h3>

              {!product.reviews || product.reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Be the first to review this product!</p>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map(rev => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-soft-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{rev.author}</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded">Verified Purchaser</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.date}</span>
                      </div>
                      <RatingStars rating={rev.rating} size={13} />
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Related from {product.category}</h2>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              View More
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
