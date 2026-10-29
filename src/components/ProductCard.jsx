import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import RatingStars from './RatingStars';
import { Heart, ShoppingBag, Eye } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const isFavorited = isInWishlist(product.id);
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300 shadow-soft-sm hover:shadow-soft transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-slate-900/90 text-white rounded-full shadow-sm backdrop-blur-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-bold bg-rose-500 text-white rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 shadow-sm ${
            isFavorited
              ? 'bg-rose-50 text-rose-500 ring-2 ring-rose-200'
              : 'bg-white/90 text-slate-500 hover:text-rose-500 hover:bg-white backdrop-blur-sm'
          }`}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={16} className={isFavorited ? 'fill-rose-500' : ''} />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 bg-white text-slate-900 font-bold text-xs uppercase tracking-wider rounded-lg shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[10px] text-brand-600">
              {product.category}
            </span>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-amber-600 font-medium text-[11px]">
                Only {product.stock} left!
              </span>
            )}
          </div>

          <Link
            to={`/product/${product.id}`}
            className="block font-semibold text-slate-800 text-sm hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-2"
          >
            {product.title}
          </Link>

          {/* Rating */}
          <div className="mb-3">
            <RatingStars
              rating={product.rating}
              size={13}
              showScore={true}
              reviewCount={product.reviewCount}
            />
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            title="Add to Cart"
          >
            <ShoppingBag size={14} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
